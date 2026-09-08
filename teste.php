<?php
if (function_exists('mail')) {
    echo "A função mail() ESTÁ habilitada no servidor.<br>";
    
    // Tenta fazer um envio de teste básico (lembre-se do parâmetro -r)
    $enviar = mail("gutoffline@gmail.com", "Teste", "Testando função", "From: cotacao@monforteusinagem.com.br", "-r cotacao@monforteusinagem.com.br");
    
    if($enviar) {
        echo "O PHP tentou enviar o e-mail com sucesso.";
    } else {
        echo "O PHP tentou enviar, mas o servidor recusou o envio.";
    }
} else {
    echo "A função mail() ESTÁ DESABILITADA nas configurações do PHP (php.ini).";
}
?>