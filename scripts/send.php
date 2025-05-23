<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 기본 응답 설정
header('Content-Type: application/json');

// 폼 데이터 수신 확인
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// 한글 메일 인코딩
header("Content-Type: text/html; charset=UTF-8");

// 1. 폼 데이터 수신
$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$email = $_POST['email'] ?? '';
$location = $_POST['location'] ?? '';
$locationOther = $_POST['locationOther'] ?? '';
$age = $_POST['age'] ?? '';
$assets = $_POST['assets'] ?? '';
$consultType = $_POST['consultType'] ?? '';
$consultTypeOther = $_POST['consultTypeOther'] ?? '';
$details = $_POST['details'] ?? '';
$preferredTime = $_POST['preferredTime'] ?? '';
$howFound = $_POST['howFound'] ?? '';
$howFoundOther = $_POST['howFoundOther'] ?? '';
$privacyAgree = $_POST['privacyAgree'] ?? '';

// 2. 이메일 내용 구성
$to = "info@mijutalk.co"; // 이 부분을 실제 받을 이메일 주소로 바꿔주세요
$subject = "💬 미주자산톡 상담 신청 - $name 님";
$message = "
<h2>미주자산톡 무료상담 신청서</h2>
<p><strong>이름:</strong> $name</p>
<p><strong>전화번호:</strong> $phone</p>
<p><strong>이메일:</strong> $email</p>
<p><strong>거주 지역:</strong> $location " . ($location === 'other' ? "($locationOther)" : "") . "</p>
<p><strong>연령대:</strong> $age</p>
<p><strong>자산 규모:</strong> $assets</p>
<p><strong>상담 주제:</strong> $consultType " . ($consultType === 'other' ? "($consultTypeOther)" : "") . "</p>
<p><strong>상세 문의 내용:</strong><br>$details</p>
<p><strong>선호 시간대:</strong> $preferredTime</p>
<p><strong>알게된 경로:</strong> $howFound " . ($howFound === 'other' ? "($howFoundOther)" : "") . "</p>
";

// 3. 메일 헤더 설정
$headers  = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
$headers .= "From: 미주자산톡 <no-reply@mijutalk.co>" . "\r\n";

// 4. 메일 전송 후 리디렉션
if (mail($to, $subject, $message, $headers)) {
    header("Location: thank-you.html");
    exit;
} else {
    // 실패했을 경우만 alert로 알림
    echo "<script>alert('메일 전송에 실패했습니다. 관리자에게 문의해주세요.'); history.back();</script>";
}
?>
