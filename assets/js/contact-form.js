// =========================================
// MONFORTE — Envio do formulário de contato (AJAX)
// =========================================
(function () {
  var form = document.getElementById('contactForm');
  var status = document.getElementById('contactStatus');
  if (!form || !status) return;

  var submitBtn = form.querySelector('.contact-submit');

  function setStatus(message, type) {
    status.textContent = message;
    status.classList.remove('is-success', 'is-error');
    if (type) status.classList.add('is-' + type);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot: se o campo "website" (escondido via CSS) vier preenchido,
    // é bot. Deixa o PHP responder normalmente sem mandar e-mail de verdade.
    setStatus('Enviando...', null);
    if (submitBtn) submitBtn.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          setStatus(data.message || 'Mensagem enviada com sucesso!', 'success');
          form.reset();
        } else {
          setStatus(data.message || 'Não foi possível enviar. Tente novamente.', 'error');
        }
      })
      .catch(function () {
        setStatus('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();