(function() {
	var linhas = [{ nome: "felipe", konra: 1 }, { djasd: 1, konra: 22}];
	var texteArea = $('#textId');
	

	tabela = $('#tabela');
	animate = $('#tabelaAnimate');

	nTable = tabela.nTable(linhas);

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