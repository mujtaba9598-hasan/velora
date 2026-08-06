<?php
session_start();

// Very simple JSON-based API for handling Authentication and Admin tasks.
$db_file = __DIR__ . '/db.json';

// Ensure DB file exists
if (!file_exists($db_file)) {
    file_put_contents($db_file, json_encode(["admin" => ["username" => "admin", "password" => "password123"], "students" => []]));
}

function getDB() {
    global $db_file;
    $content = file_get_contents($db_file);
    return json_decode($content, true);
}

function saveDB($data) {
    global $db_file;
    file_put_contents($db_file, json_encode($data, JSON_PRETTY_PRINT));
}

function jsonResponse($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, TRUE);
    
    // Login
    if ($action === 'login') {
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        $db = getDB();

        // Check Admin
        if ($username === $db['admin']['username'] && $password === $db['admin']['password']) {
            $_SESSION['user_id'] = 'admin';
            $_SESSION['role'] = 'admin';
            jsonResponse(["status" => "success", "role" => "admin"]);
        }

        // Check Students
        foreach ($db['students'] as $student) {
            if ($student['email'] === $username && $student['password'] === $password) {
                if (isset($student['status']) && $student['status'] === 'blocked') {
                    jsonResponse(["status" => "error", "message" => "Account access is blocked."]);
                }
                $_SESSION['user_id'] = $student['id'];
                $_SESSION['role'] = 'student';
                $_SESSION['email'] = $student['email'];
                jsonResponse(["status" => "success", "role" => "student"]);
            }
        }
        jsonResponse(["status" => "error", "message" => "Invalid credentials."]);
    }

    // Admin Actions (Require Admin Session)
    if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {
        if ($action === 'create_user') {
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            
            $db = getDB();
            // Check if exists
            foreach ($db['students'] as $s) {
                if ($s['email'] === $email) {
                    jsonResponse(["status" => "error", "message" => "User already exists."]);
                }
            }
            
            $newUser = [
                "id" => uniqid(),
                "email" => $email,
                "password" => $password,
                "status" => "active"
            ];
            $db['students'][] = $newUser;
            saveDB($db);
            jsonResponse(["status" => "success", "message" => "User created."]);
        }
        
        if ($action === 'change_password') {
            $user_id = $input['user_id'] ?? '';
            $new_password = $input['new_password'] ?? '';
            
            $db = getDB();
            foreach ($db['students'] as &$s) {
                if ($s['id'] === $user_id) {
                    $s['password'] = $new_password;
                    saveDB($db);
                    jsonResponse(["status" => "success", "message" => "Password updated."]);
                }
            }
            jsonResponse(["status" => "error", "message" => "User not found."]);
        }

        if ($action === 'toggle_block') {
            $user_id = $input['user_id'] ?? '';
            
            $db = getDB();
            foreach ($db['students'] as &$s) {
                if ($s['id'] === $user_id) {
                    $s['status'] = ($s['status'] === 'active') ? 'blocked' : 'active';
                    saveDB($db);
                    jsonResponse(["status" => "success", "message" => "Status toggled.", "new_status" => $s['status']]);
                }
            }
            jsonResponse(["status" => "error", "message" => "User not found."]);
        }

        if ($action === 'delete_user') {
            $user_id = $input['user_id'] ?? '';
            
            $db = getDB();
            foreach ($db['students'] as $key => $s) {
                if ($s['id'] === $user_id) {
                    array_splice($db['students'], $key, 1);
                    saveDB($db);
                    jsonResponse(["status" => "success", "message" => "User deleted."]);
                }
            }
            jsonResponse(["status" => "error", "message" => "User not found."]);
        }
    } else {
        if ($action === 'create_user' || $action === 'change_password' || $action === 'toggle_block' || $action === 'delete_user') {
            jsonResponse(["status" => "error", "message" => "Unauthorized access."]);
        }
    }
}

// GET Requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'check_session') {
        if (isset($_SESSION['role'])) {
            jsonResponse(["status" => "success", "role" => $_SESSION['role'], "email" => $_SESSION['email'] ?? 'admin']);
        }
        jsonResponse(["status" => "error", "message" => "Not logged in"]);
    }
    
    if ($action === 'logout') {
        session_destroy();
        jsonResponse(["status" => "success"]);
    }

    if ($action === 'list_users' && isset($_SESSION['role']) && $_SESSION['role'] === 'admin') {
        $db = getDB();
        $users = [];
        // Send back safe data
        foreach ($db['students'] as $s) {
            $users[] = [
                "id" => $s['id'],
                "email" => $s['email'],
                "password" => $s['password'], // Client specifically requested admin can see/change passwords
                "status" => $s['status'] ?? 'active'
            ];
        }
        jsonResponse(["status" => "success", "users" => $users]);
    }
}

jsonResponse(["status" => "error", "message" => "Invalid endpoint or missing action"]);
?>
