# Configuração de Webhook do Stripe

## O que é um webhook?
Um webhook é um callback HTTP que o Stripe usa para notificar sua aplicação sobre eventos (pagamentos confirmados, falhas, reembolsos, etc).

## Como configurar no Stripe Dashboard

### 1. Acesse o Dashboard
- Vá para https://dashboard.stripe.com
- Acesse: **Developers** → **Webhooks**

### 2. Crie um novo webhook
- Clique em **Add endpoint**
- Em "Endpoint URL", insira: `https://seu-dominio.com/api/webhooks/stripe`
  - **Para desenvolvimento local:** Use Stripe CLI (veja abaixo)
  - **Para produção:** Use seu domínio real

### 3. Selecione os eventos a receber
Recomendado:
- `checkout.session.completed` - Pagamento confirmado
- `payment_intent.succeeded` - Pagamento bem-sucedido
- `payment_intent.payment_failed` - Falha no pagamento
- `charge.refunded` - Reembolso processado

### 4. Obtenha o Webhook Secret
- Após criar o webhook, clique em "Reveal" para ver o **Signing secret**
- Copie este valor e adicione em `.env.local`:
  ```
  STRIPE_WEBHOOK_SECRET=whsec_test_...
  ```

---

## Desenvolvimento Local com Stripe CLI

### Instale Stripe CLI
- Windows: https://github.com/stripe/stripe-cli/releases
- macOS: `brew install stripe/stripe-cli/stripe`
- Linux: https://stripe.com/docs/stripe-cli

### Configure Stripe CLI
```bash
stripe login
```

### Teste o webhook localmente
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Stripe CLI exibirá um comando:
```
> Ready! Your webhook signing secret is: whsec_test_...
```

Copie este secret e adicione em `.env.local`.

### Simule eventos (em outro terminal)
```bash
stripe trigger payment_intent.succeeded
stripe trigger checkout.session.completed
```

---

## Variáveis de Ambiente Necessárias

```env
# .env.local
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

---

## Fluxo de Integração

```
Cliente → "Finalizar Compra" 
    ↓
/api/checkout (cria Stripe Session)
    ↓
Stripe Checkout UI
    ↓
Pagamento confirmado
    ↓
Stripe → /api/webhooks/stripe (webhook)
    ↓
Seu backend processa o pedido
    ↓
Email de confirmação enviado
```

---

## Implementação Atual

A rota `/api/webhooks/stripe` já está criada e trata os seguintes eventos:

1. **checkout.session.completed** → Pedido confirmado
2. **payment_intent.succeeded** → Pagamento bem-sucedido
3. **payment_intent.payment_failed** → Falha no pagamento
4. **charge.refunded** → Reembolso processado

### TODO (implementar no seu banco de dados):
- [ ] Criar registro de pedido ao receber `checkout.session.completed`
- [ ] Enviar email de confirmação
- [ ] Atualizar status do inventário
- [ ] Log de transações/reembolsos

---

## Testar no Stripe Dashboard

1. Vá para **Test data** → **Test mode**
2. Use cartão de teste: `4242 4242 4242 4242`
3. Validade: qualquer data futura (ex: `12/25`)
4. CVC: qualquer número (ex: `123`)
5. Faça um pagamento e veja o evento no Dashboard

---

## Segurança

✅ A rota valida a assinatura do webhook (`stripe-signature` header)
✅ Aceita apenas requests autenticados do Stripe
✅ O secret nunca é exposto no cliente (somente no servidor via `.env.local`)

---

## Links Úteis
- Docs: https://stripe.com/docs/webhooks
- Eventos: https://stripe.com/docs/api/events/types
- Stripe CLI: https://stripe.com/docs/stripe-cli
