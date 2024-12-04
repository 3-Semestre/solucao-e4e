const Filters = {
    nome: null,
    cpf: null,
    nicho: null,
    nivelIngles: null,
    situacao: null,

    buildQueryString: function () {
        let params = [];
        if (this.nome) params.push(`nome=${encodeURIComponent(this.nome)}`);
        if (this.cpf) params.push(`cpf=${encodeURIComponent(this.cpf)}`);
        if (this.nicho) params.push(`nicho=${encodeURIComponent(this.nicho)}`);
        if (this.nivelIngles) params.push(`nivelIngles=${encodeURIComponent(this.nivelIngles)}`);
        if (this.situacao) params.push(`situacao=${encodeURIComponent(this.situacao)}`);
        return params.length ? `&${params.join("&")}` : ""; 
      }
};
