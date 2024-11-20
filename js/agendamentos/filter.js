const Filters = {
    nome: null,
    dataInicio: null,
    dataFim: null,
    horarioInicio: null,
    horarioFim: null,
  
    buildQueryString: function () {
      let params = [];
      if (this.nome) params.push(`nome=${encodeURIComponent(this.nome)}`);
      if (this.dataInicio) params.push(`dataInicio=${encodeURIComponent(this.dataInicio)}`);
      if (this.dataFim) params.push(`dataFim=${encodeURIComponent(this.dataFim)}`);
      if (this.horarioInicio) params.push(`horarioInicio=${encodeURIComponent(this.horarioInicio)}`);
      if (this.horarioFim) params.push(`horarioFim=${encodeURIComponent(this.horarioFim)}`);
      return params.length ? `&${params.join("&")}` : ""; 
    },
  
    updateFromInputs: function () {
      this.nome = document.getElementById("aluno").value || null;
      this.dataInicio = document.getElementById("data_inicio").value || null;
      this.dataFim = document.getElementById("data_fim").value || null;
      this.horarioInicio = document.getElementById("horario_inicio").value || null;
      this.horarioFim = document.getElementById("horario_fim").value || null;
    }
  };
  