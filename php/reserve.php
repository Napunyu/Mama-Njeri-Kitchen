<?php
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit();
}

require_once "config.php";

$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$date = trim($_POST["date"] ?? "");
$guests = filter_input(INPUT_POST, "guests", FILTER_VALIDATE_INT);
$meal = trim($_POST["meal"] ?? "");
$requests = trim($_POST["requests"] ?? "");

if (strlen($name) < 2) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Full name is required."]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid email address."]);
    exit();
}

$cleanedPhone = preg_replace('/[\s\-()]/', '', $phone);
if (!preg_match('/^(\+254|254|0)[17]\d{8}$/', $cleanedPhone)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid phone number."]);
    exit();
}

$today = date("Y-m-d");
if (empty($date) || $date < $today) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Please select today or a future date."]);
    exit();
}

if ($guests === false || $guests < 1 || $guests > 30) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Guests must be between 1 and 30."]);
    exit();
}

try {
    $stmt = $pdo->prepare(
        "INSERT INTO reservations (full_name, email, phone, reservation_date, guests, preferred_meal, special_requests)
         VALUES (:full_name, :email, :phone, :reservation_date, :guests, :preferred_meal, :special_requests)"
    );

    $stmt->execute([
        ":full_name" => $name,
        ":email" => $email,
        ":phone" => $phone,
        ":reservation_date" => $date,
        ":guests" => $guests,
        ":preferred_meal" => $meal !== "" ? $meal : null,
        ":special_requests" => $requests !== "" ? $requests : null
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Asante, " . htmlspecialchars($name, ENT_QUOTES, "UTF-8") . "! Your table for $guests on $date has been reserved."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Failed to save reservation. Please try again."
    ]);
}