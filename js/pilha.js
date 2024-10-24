function getAgendamentoStack() {
    const stack = sessionStorage.getItem('agendamentoStack');
    return stack ? JSON.parse(stack) : [];
}

function setAgendamentoStack(stack) {
    sessionStorage.setItem('agendamentoStack', JSON.stringify(stack));
}

function pushAgendamentoStack(agendamentoId) {
    const stack = getAgendamentoStack();
    stack.push(agendamentoId);
    setAgendamentoStack(stack);
}

function popAgendamentoStack() {
    const stack = getAgendamentoStack();
    if (stack.length > 0) {
        const agendamentoId = stack.pop();
        setAgendamentoStack(stack);
        return agendamentoId;
    }
    return null;
}

function peekAgendamentoStack() {
    const stack = getAgendamentoStack();
    return stack.length > 0 ? stack[stack.length - 1] : null;
}
