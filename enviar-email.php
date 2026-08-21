<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json; charset=utf-8');

function respond(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['success' => $status < 400, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

$configFile = __DIR__ . '/config/email.php';
if (!is_file($configFile)) {
    respond(500, 'A configuração de e-mail não foi encontrada no servidor.');
}

require $configFile;
require __DIR__ . '/PHPMailer-7.1.1/src/Exception.php';
require __DIR__ . '/PHPMailer-7.1.1/src/PHPMailer.php';
require __DIR__ . '/PHPMailer-7.1.1/src/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, 'Método não permitido.');
}

$name = trim((string) ($_POST['name'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$whatsapp = trim((string) ($_POST['whatsapp'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $phone === '' || $email === '' || $message === '') {
    respond(422, 'Preencha todos os campos obrigatórios.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, 'Informe um endereço de e-mail válido.');
}

if (strlen($name) > 120 || strlen($phone) > 40 || strlen($whatsapp) > 40 || strlen($email) > 160 || strlen($message) > 5000) {
    respond(422, 'Um ou mais campos excedem o tamanho permitido.');
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = EMAIL_SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = EMAIL_SMTP_USERNAME;
    $mail->Password = EMAIL_SMTP_PASSWORD;
    $mail->SMTPSecure = EMAIL_SMTP_SECURE === 'ssl'
        ? PHPMailer::ENCRYPTION_SMTPS
        : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = EMAIL_SMTP_PORT;
    $mail->CharSet = 'UTF-8';

    $mail->setFrom(EMAIL_FROM, EMAIL_FROM_NAME);
    $mail->addAddress(EMAIL_TO);
    $mail->addReplyTo($email, $name);

    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safePhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
    $safeWhatsapp = htmlspecialchars($whatsapp !== '' ? $whatsapp : 'Não informado', ENT_QUOTES, 'UTF-8');
    $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

    $mail->isHTML(true);
    $mail->Subject = 'Novo contato pelo site Monforte';
    $mail->Body = <<<HTML
        <h2>Novo contato pelo site Monforte</h2>
        <p><strong>Nome:</strong> {$safeName}</p>
        <p><strong>Telefone:</strong> {$safePhone}</p>
        <p><strong>WhatsApp:</strong> {$safeWhatsapp}</p>
        <p><strong>E-mail:</strong> {$safeEmail}</p>
        <p><strong>Mensagem:</strong><br>{$safeMessage}</p>
    HTML;
    $mail->AltBody = "Novo contato pelo site Monforte\n\nNome: {$name}\nTelefone: {$phone}\nWhatsApp: {$whatsapp}\nE-mail: {$email}\nMensagem:\n{$message}";

    $mail->send();
    respond(200, 'Mensagem enviada com sucesso. Em breve entraremos em contato.');
} catch (Exception $exception) {
    $mailError = $mail->ErrorInfo !== '' ? $mail->ErrorInfo : $exception->getMessage();
    error_log('Erro ao enviar formulário Monforte: ' . $mailError);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'ok' => false,
        'message' => 'Falha ao enviar o formulário.',
        'error' => 'Falha ao enviar: ' . $mailError,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
