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
			animationDuration: 500
		};
		
		var table = {
			lines: [],
			columns: [],
			newLines: [],
			deletedLines: []
		}

		var get = {};

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

		self.setSettings = function(set) {
			$.extend(settings, set);
		}

		//Create ------------------------------------------------------------------------------------------------------------------------------------------------
		function createTable(tableHtml, theadHtml, tbodyHtml) {
			function append() {
				$this.append(tableHtml)
				.find('table').
				append(theadHtml).
				append(tbodyHtml);
				getPadding();
			}

			if (isAnimated()) {
				if (isTableCreated()) {
					collapseAll(undefined, function() {
						removeTable();
						append();
						collapseAll(0);
						expandAll();
					});
				} else {
					removeTable();
					append();
					collapseAll(0);
					expandAll();
				}
			} else {
				removeTable();
				append();
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

		//Gets ------------------------------------------------------------------------------------------------------------------------------------------------
		function checkGet(propt) {
			return get[propt];
		}

		function getPadding() {
			var attr = checkGet('padding');
			if (attr)
				return attr;

			var tds = $this.find('td')
			if (!tds)
				return false;
			var td = $(tds[0]);
			var padding = td.css('padding');
			setPadding(padding);
			return getPadding();
		}

		//Sets ------------------------------------------------------------------------------------------------------------------------------------------------
		function setPropt(propt, value) {
			get[propt] = value;
		}

		function setPadding(value) {
			setPropt('padding', value);
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
					children: [{
						tag: 'div',
						html: '${name' + i + '}'
					}]
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
			checkNewLines(lines);
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

		//Animações  ------------------------------------------------------------------------------------------------------------------------------------------------
		function collapse(tr, duration, callback) {
			if (!duration && duration != 0)
				duration = animationDuration();
			var td = tr.find('td');
			var divs = tr.find('div');
			if (td.length < 1)
				td = tr.find('th');
			divs.css('overflow', 'hidden');

			divs.animate({ height: 0 }, duration);
			td.animate({ padding: 0 }, duration);
			tr.animate({ height: 0 }, duration, callback);
		}

		function expand(tr, duration, callback) {
			if (!duration && duration != 0)
				duration = animationDuration();
			var td = tr.find('td');
			if (td.length < 1)
				td = tr.find('th');
			var divs = tr.find('div');
			divs.css('overflow', 'hidden')

			tr.css('height', 'initial');
			divs.css('height', 'initial');
			var finalHeight = tr.innerHeight();
			var finalHeightD = divs.innerHeight();
			var padding = getPadding();

        	divs.css('height', 0);
			td.css('padding', 0);

			divs.animate({ height: finalHeightD }, duration);
			td.animate({ padding: padding }, duration, callback);
			tr.animate({ height: finalHeight }, duration, function() {
				tr.removeAttr('style');
				td.removeAttr('style');
				divs.removeAttr('style');
			});
		}

		function collapseHeader(duration, callback) {
			var header = $($this.find('tr')[0]);	
			aaaa = header;		
			collapse(header, duration, callback);
		}

		function expandHeader(duration, callback) {
			var header = $($this.find('tr')[0]);
			expand(header, duration, callback);
		}

		function collapseRow(index) {
			index++;
			var trs = $this.find('tr');
			for (var i = 0; i < trs.length; i++) {
				if (i == index) {
					var tr = $(trs[i]);
					collapse(tr);
				}
			}
		}

		function expandRow(index) {
			index++;
			var trs = $this.find('tr');
			for (var i = 0; i < trs.length; i++) {
				if (i == index) {
					var tr = $(trs[i]);
					expand(tr);
				}
			}
		}

		function collapseAllRows(duration, callback) {
			var sendedCallBack = false;
			var trs = $this.find('tr');
			for (var i = 1; i < trs.length; i++) {
				var tr = $(trs[i]);
				if (!sendedCallBack) {
					sendedCallBack = true;
					collapse(tr, duration, callback);
				} else {
					collapse(tr, duration);
				}
			}	
		}

		function expandAllRows(duration, callback) {
			var sendedCallBack = false;
			var trs = $this.find('tr');
			for (var i = 1; i < trs.length; i++) {			
				var tr = $(trs[i]);
				if (!sendedCallBack) {
					sendedCallBack = true;
					expand(tr, duration, callback);
				} else {
					expand(tr, duration);
				}
			}
		}

		function collapseAll(duration, callback) {
			collapseHeader(duration, callback);
			collapseAllRows(duration);
		}

		function expandAll(duration, callback) {
			expandHeader(duration, callback);
			expandAllRows(duration);
		}

		//Funcoes ------------------------------------------------------------------------------------------------------------------------------------------------
		function capitaliseFirstLetter(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		}
	}

	
	
})(jQuery);