<?php
/**
 * MONFORTE — Envio do formulário de contato via mail() nativo do PHP
 * ---------------------------------------------------------------
 * Compatível com hospedagem compartilhada Locaweb (sendmail já configurado
 * no servidor, não precisa de conta de e-mail nem SMTP).
 *
 * ANTES DE SUBIR PRO AR, EDITE OS 3 ITENS ABAIXO:
 *   1) DESTINATARIO   -> e-mail que vai RECEBER as mensagens do site
 *   2) DOMINIO_SITE    -> o domínio do site (usado no endereço "De:")
 *   3) NOME_SITE       -> nome que aparece como remetente
 */

// ============================================================
// 1) CONFIGURAÇÃO — edite aqui
// ============================================================
const DESTINATARIO = 'gutoffline@gmail.com';   // <-- e-mail real que vai receber (Gmail, Outlook, etc.)
const DOMINIO_SITE  = 'monforteusinagem.com.br';           // <-- domínio do site, sem "www."
const NOME_SITE     = 'Monforte';                        // <-- nome exibido como remetente

// ============================================================
// Envia sempre uma resposta JSON válida, mesmo se algo inesperado
// quebrar no meio do caminho (evita a tela de erro 500 em branco).
// ============================================================
header('Content-Type: application/json; charset=utf-8');

set_exception_handler(function ($e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erro interno no servidor.',
        'debug'   => $e->getMessage(), // remova esta linha quando tudo estiver funcionando
    ]);
    exit;
});

set_error_handler(function ($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// ============================================================
// A partir daqui normalmente não precisa mexer
// ============================================================

// Só aceita POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
    exit;
}

/**
 * Remove quebras de linha de um campo para impedir "header injection"
 * (técnica onde alguém tenta injetar cabeçalhos extra de e-mail via formulário).
 */
function limpar($valor) {
    $valor = trim($valor ?? '');
    $valor = str_replace(["\r", "\n", "%0a", "%0d"], '', $valor);
    return $valor;
}

// --------------------------------------------------------
// Captura e sanitiza os campos do formulário
// --------------------------------------------------------
$nome      = limpar($_POST['name'] ?? '');
$telefone  = limpar($_POST['phone'] ?? '');
$whatsapp  = limpar($_POST['whatsapp'] ?? '');
$email     = limpar($_POST['email'] ?? '');
$mensagem  = trim($_POST['message'] ?? ''); // mensagem pode ter quebras de linha normais

// Campo "honeypot" opcional (veja nota no final sobre anti-spam).
// Se existir e vier preenchido, é bot: finge sucesso e não envia nada.
if (!empty($_POST['website'])) {
    echo json_encode(['success' => true]);
    exit;
}

// --------------------------------------------------------
// Validação básica
// --------------------------------------------------------
$erros = [];

if ($nome === '' || strlen($nome) < 2) {
    $erros[] = 'Informe seu nome.';
}

if ($telefone === '') {
    $erros[] = 'Informe um telefone.';
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erros[] = 'Informe um e-mail válido.';
}

if (trim($mensagem) === '') {
    $erros[] = 'Escreva uma mensagem.';
}

if (!empty($erros)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $erros)]);
    exit;
}

// --------------------------------------------------------
// Monta o e-mail
// --------------------------------------------------------
$assunto = "Novo contato pelo site — {$nome}";

$corpo  = "Você recebeu uma nova mensagem pelo formulário do site.\n\n";
$corpo .= "Nome: {$nome}\n";
$corpo .= "Telefone: {$telefone}\n";
$corpo .= "WhatsApp: " . ($whatsapp !== '' ? $whatsapp : '(não informado)') . "\n";
$corpo .= "E-mail: {$email}\n\n";
$corpo .= "Mensagem:\n{$mensagem}\n";

// Remetente técnico (precisa ser do mesmo domínio do site para não cair no spam
// nem ser rejeitado pelo servidor). Como você pediu, usaremos o e-mail de cotação
// do domínio conforme a conta existente no site.
$remetente = 'cotacao@' . DOMINIO_SITE;

$headers   = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'From: ' . NOME_SITE . ' <' . $remetente . '>';
$headers[] = 'Return-Path: <' . $remetente . '>';
$headers[] = 'Reply-To: ' . $nome . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$headersStr = implode("\n", $headers);

// --------------------------------------------------------
// Verifica se a função mail() está disponível no servidor
// (a Locaweb costuma exigir liberação manual no painel/suporte)
// --------------------------------------------------------
if (!function_exists('mail')) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'O envio de e-mail está desabilitado neste servidor. Entre em contato com o suporte da hospedagem para habilitar a função mail() do PHP.',
    ]);
    exit;
}

// --------------------------------------------------------
// Envia
// --------------------------------------------------------
// A Locaweb exige o 5º parâmetro (-r) definindo o remetente do envelope,
// senão o servidor bloqueia o envio silenciosamente.
// Referência: https://www.locaweb.com.br/ajuda/wiki/como-enviar-e-mails-com-a-funcao-mail-do-php-hospedagem-de-sites/
$parametrosExtras = '-r' . $remetente;

$enviado = @mail(DESTINATARIO, $assunto, $corpo, $headersStr, $parametrosExtras);

if ($enviado) {
    echo json_encode(['success' => true, 'message' => 'Mensagem enviada com sucesso!']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Não foi possível enviar. Tente novamente em instantes.']);
}