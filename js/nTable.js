(function($) {

	$.fn.nTable = function(lines) {
		var table = new nTable(this);
		if (lines)
			table.create(lines);
		return table;
	}

	var nTable = function($this) {

		var self = this;

		var settings = {
			animated: true,
			animationDuration: 250
		};
		
		var table = {
			lines: [],
			columns: [],
			newLines: [],
			deletedLines: []
		}

		//Prototype ------------------------------------------------------------------------------------------------------------------------------------------------
		self.create = function(lines) {
			if (lines) {
				setLines(lines);
				setColumnsByLines(table.lines);
			}

			createTable(createTableHtml(), createTheadHtml(), createTbodyHtml());
		}

		self.refresh = function(lines) {
			self.create(lines);
		}

		self.animar = function() {
			animateRows();
		}

		self.setSettings = function(set) {
			$.extend(settings, set);
		}

		function createTable(tableHtml, theadHtml, tbodyHtml) {
			function append() {
				$this.append(tableHtml)
				.find('table').
				append(theadHtml).
				append(tbodyHtml);
			}

			if (isTableCreated()){
				if (isAnimated()) {
					$this.fadeOut(animationDuration(), function() {
						removeTable();
						append();
						$this.fadeIn(animationDuration());
					});
				} else {
					removeTable();
					append();
				}
			} else {
				if (isAnimated()) {
					$this.fadeOut(0);
					append();
					$this.fadeIn(animationDuration());
				} else {
					append();	
				}
			}
			
		}

		//Verifications ------------------------------------------------------------------------------------------------------------------------------------------------
		function isAnimated() {
			return settings.animated;
		}

		function isTableCreated() {
			return ($this.find('table').length > 0 ? true : false);
		}

		function animationDuration() {
			return settings.animationDuration;
		}

		//Remover ------------------------------------------------------------------------------------------------------------------------------------------------
		function removeTable() {
			$this.find('table').remove();
		}

		function removeThead(table) {
			table.find('thead').remove();
		}

		function removeTbody(table) {
			table.find('tbody').remove();
		}

		//Gerar HTML ------------------------------------------------------------------------------------------------------------------------------------------------
		function createTableHtml() {
			var data = {};
			var transform = [{
				tag: 'table',
				class: 'table table-bordered table-condensed'
			}];

			return json2html.transform(data, transform);
		}

		function createTheadHtml() {
			var data = {};
			var subTranform = [];

			for (var i = 0; i < table.columns.length; i++) {
				var column = table.columns[i];

				data['name' + i] = capitaliseFirstLetter(column['name']);
				subTranform.push({
					tag: 'th',
					html: '${name' + i + '}'
				});
			}

			var transform = [{
				tag: 'thead',
				children: [{
					tag: 'tr',
					children: subTranform
				}]
			}];

			return json2html.transform(data, transform);
		}

		function createTbodyHtml() {
			var dataTr = [];
			var subTransformTr = [];

			for (var i = 0; i < table.lines.length; i++) {
				var line = table.lines[i];

				dataTr.push({});
				
				for (var j = 0; j < table.columns.length; j++) {
					var column = table.columns[j];

					dataTr[i]['name' + j] = line[column['name']];
					if (subTransformTr.length < table.columns.length) {
						subTransformTr.push({
							tag: 'td',							
							children: [{
								tag: 'div',
								html: '${name' + j + '}'
							}]
						});
					}
				}
			}
			var transformTr = [{
				tag: 'tr',
				children: subTransformTr
			}]
				
			var tr = json2html.transform(dataTr, transformTr);

			var data = [{
				tr: tr
			}];
			var transform = [{
				tag: 'tbody',
				html: '${tr}'
			}];

			return json2html.transform(data, transform);
		}

		//Linas e Colunas ------------------------------------------------------------------------------------------------------------------------------------------------
		function generateColumns(lines) {
			var columns = [];
			var propts = [];

			function checkProptExist(propt) {
				for (var i = 0; i < propts.length; i++) {
					if (propts[i] == propt)
						return true;
				}
				return false;
			};

			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];

				for (var propt in line) {
					if (!checkProptExist(propt)) {
						propts.push(propt);
						var field = line[propt];
						columns.push({
							type: typeof(field),
							name: propt
						});
					}
				}
			}
			return columns;
		}

		function setLines(lines) {
			table.lines = treatLinesOrColumns(lines);
		}

		function setColumnsByLines(lines) {
			setColumns(generateColumns(lines));
		}

		function setColumns(columns) {
			table.columns = treatLinesOrColumns(columns);
		}

		function treatLinesOrColumns(lines) {
			if (!lines || typeof lines !== "object")
				return [];
			if (!lines.length)
				lines = [lines];
			return lines;
		}

		function checkNewLines(lines) {
			table.newLines = [];
			table.deletedLines = [];
			for (var i = 0; i < lines.length; i++) {
				var nLine = lines[i];
				var isNew = true;

				for (var j = 0; j < table.lines.length; j++) {
					var oLine = table.lines[j];

					if (JSON.stringify(nLine) == JSON.stringify(oLine)) {
						isNew = false;
						break;
					}
				}
			if(isNew)
				table.newLines.push(i);

			}
			console.log(table.newLines);
		}

		function animateRows() {
			var trs = $this.find('tr');
			for (var i = 0; i < table.newLines.length; i++) {
				var tr = $(trs[table.newLines[i] + 1]);
				var div = tr.find('div');
				div.css('height', 'initial');
				var finalHeight = div.height();

				console.log(finalHeight)
				tr.addClass('trHeight');
				div.animate({ height: finalHeight }, 500, function() {					
					tr.removeClass('trHeight');
					div.css('height', 'initial');					
				});
			}
			return false;
		}

		//Funcoes ------------------------------------------------------------------------------------------------------------------------------------------------
		function capitaliseFirstLetter(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		}
	}

	
	
})(jQuery);