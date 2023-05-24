function gera_cor(qtd=1){
    var bg_color = []
    var border_color = []
    for(let i = 0; i < qtd; i++){
        let r = Math.random() * 255;
        let g = Math.random() * 255;
        let b = Math.random() * 255;
        bg_color.push(`rgba(${r}, ${g}, ${b}, ${0.2})`)
        border_color.push(`rgba(${r}, ${g}, ${b}, ${1})`)
    }
    
    return [bg_color, border_color];
    
}

function renderiza_total_vendido(url){  
    fetch(url, {
        method: 'get',
    }).then(function(result){
        return result.json()
    }).then(function(data){
        document.getElementById('faturamento_total').innerHTML = data.total_vendas
    })

}



function renderiza_produtos_mais_vendidos(url){
    fetch(url, {
        method: 'get',
    }).then(function(result){
        return result.json()
    }).then(function(data){
        document.getElementById('produtos_mais_vendidos').innerHTML = data.mais_vendido
    })
  
}

function renderiza_tikect_medio(url){  
    fetch(url, {
        method: 'get',
    }).then(function(result){
        return result.json()
    }).then(function(data){
        document.getElementById('ticket_medio').innerHTML = data.ticket_medio
    })

}

function renderiza_bairro_mais_pedido(url){
    fetch(url, {
        method: 'get',
    }).then(function(result){
        return result.json()
    }).then(function(data){
        document.getElementById('bairro_mais_pedido').innerHTML = data.bairro_mais_pedido
    })
  
}

function renderiza_total_vendas_12_meses(url){


    fetch(url)
    .then(response => response.json())  // Converte a resposta em JSON
    .then(data => {
      // Extrai as informações relevantes do objeto JSON para gerar o gráfico
      const labels = data.data.map(item => item.mes_venda);
      const values = data.data.map(item => item.total_vendas);
      const canvas = document.getElementById('faturamento_mensal').getContext('2d');
      var cores_faturamento_mensal = gera_cor(qtd=12)

      // Configura o gráfico
      const chart = new Chart(canvas, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Total de vendas",
              data: values,
              backgroundColor: cores_faturamento_mensal[0],
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    })
    .catch(error => console.error(error));


}



function renderiza_fluxo_12_meses(url) {
  fetch(url)
    .then(response => response.json())  // Converte a resposta em JSON
    .then(data => {
      // Extrai as informações relevantes do objeto JSON para gerar o gráfico

      const labels = data.data.map(item => `${item.mes}/${item.ano}`);
      const despesas = data.data.map(item => item.despesa.total);
      const receitas = data.data.map(item => item.receita.total);
      const canvas = document.getElementById('fluxo_mensal').getContext('2d');

      // Configura o gráfico
      const chart = new Chart(canvas, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Despesa",
              data: despesas,
              backgroundColor: "red",
            },
            {
              label: "Receita",
              data: receitas,
              backgroundColor: "green",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    })
    .catch(error => console.error(error));
}