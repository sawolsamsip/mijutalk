<?php
// HTTP 요청이 POST 방식인지 확인합니다.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 폼에서 전송된 데이터를 가져오고, 보안을 위해 입력값을 정리합니다.
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($_POST["phone"]));
    $message = trim($_POST["message"]);

    // 필수 입력값이 비어있는지 확인합니다.
    if (empty($name) || empty($phone) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // 에러가 있으면 400 Bad Request 응답을 보냅니다.
        http_response_code(400);
        echo "Please complete the form and try again.";
        exit;
    }

    // ===================================================================
    // 중요: 이메일을 받을 주소를 여기에 입력하세요.
    // ===================================================================
    $recipient = "sanghyun.lee@wellsfargo.com, sawolsamsip@gmail.com";
    
    // 이메일 제목을 설정합니다.
    $subject = "New Consultation Request from $name";

    // 이메일 본문을 구성합니다.
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n\n";
    $email_content .= "Message:\n$message\n";

    // 이메일 헤더를 설정합니다.
    // 고객이 답장할 때, 고객의 이메일 주소로 바로 답장할 수 있도록 설정합니다.
    $email_headers = "From: $name <$email>";

    // PHP의 mail() 함수를 사용하여 이메일을 보냅니다.
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        // 성공 시 200 OK 응답과 함께 "success" 메시지를 보냅니다.
        http_response_code(200);
        echo "success";
    } else {
        // 실패 시 500 Internal Server Error 응답을 보냅니다.
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
    }

} else {
    // POST 요청이 아닐 경우 403 Forbidden 응답을 보냅니다.
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>
