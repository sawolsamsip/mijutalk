<?php
// webhook.php (웹서버에서 공개된 위치에 배치, 예: /var/www/html/webhook.php)

// GitHub에서 전송된 헤더 중 시크릿(signature) 확인(보안을 위해, 선택 사항)
$secret = '여기에_웹훅_시크릿_입력'; // GitHub 웹훅 설정에서 같은 값 입력

// GitHub 이벤트 검증
$signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
$payload = file_get_contents('php://input');

$hash = 'sha256=' . hash_hmac('sha256', $payload, $secret);
if (!hash_equals($hash, $signature)) {
    header('HTTP/1.1 403 Forbidden');
    echo "Invalid signature";
    exit;
}

// Git pull 실행 (보안상 꼭 필요한 권한 설정 완료 후 사용)
exec('cd /var/www/html && git pull 2>&1', $output, $return_var);

if ($return_var === 0) {
    echo "Deployment successful:\n";
    echo implode("\n", $output);
} else {
    echo "Deployment failed:\n";
    echo implode("\n", $output);
}
?>
