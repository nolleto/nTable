(function() {
	var linhas = [{ nome: "felipe", idade: 1 }, { nome: 'konrad', idade: 22 }, { nome: 'json', idade: 5000 }];
	var input = $('#inputLinhas');
	var form = $('form');
	var tabela = $('#tabela');
	var btn = $('#submitButton');
	 mynTable = tabela.nTable(linhas);
	var ok = true;
	
	input.val(JSON.stringify(linhas)).
	bind('keyup', function() {
		var val = input.val();
		try {
			linhas = JSON.parse(val);
			btn.removeClass('btn-danger');			
			btn.addClass('btn-success');
			ok = true;
		} catch (ex) {
			btn.removeClass('btn-success');
			btn.addClass('btn-danger');
			ok = false;
		}
	});


	$('#animarButton').click(function() {
		mynTable.animar(1);
	})

	form.submit(function() {
		if (ok)
			generateNTable();
		else 
			alert('JSON está errado =(');
		return false;
	});

	function generateNTable(lines){
		if (mynTable)
			mynTable.refresh(linhas);
		else
			mynTable = tabela.nTable(linhas);
	}
})()

function mediaPonderada(notas) {
	var valor = 0;
	var pesos = 0;
	for (var i = 0; i < notas.length; i++) {
		var nota = notas[i];
		var peso = nota[1];
		valor += nota[0] * peso;
		pesos += peso;
	}
	console.log("Valor: " + valor + "\nPeso: " + pesos);
	return (valor / pesos);
}

function media (valores){
	var valor = 0;
	var peso = 0;
	for (var i = 0; i < valores.length; i++) {
		valor += valores[i];
		peso++;
	}
	console.log("Valor: " + valor + "\nPeso: " + peso);
	return (valor / peso);
}

/* Exemplo Konrad
var a = (function() {
	
	var count = 0;
	var glob = undefined;

	function B() {
		count++;
		var bilingue = undefined;

		this.setG = function(g) {
			glob = g;
		}

		this.setB = function(b) {
			bilingue = b;
		}

		this.alert = function() {
			alert("Glob: " + g + "\nBilingue: " + b);
		}

		function teste() {}
	}

	return B;
})();
*/