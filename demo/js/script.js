$(function(){
	SyntaxHighlighter.autoloader(
		"bash					js/libs/syntaxhighlighter/shBrushBash.js",
		"css					js/libs/syntaxhighlighter/shBrushCss.js",
		"diff					js/libs/syntaxhighlighter/shBrushDiff.js",
		"html xml xhtml			js/libs/syntaxhighlighter/shBrushXml.js",
		"js jscript javascript	js/libs/syntaxhighlighter/shBrushJScript.js",
		"perl pl				js/libs/syntaxhighlighter/shBrushPerl.js",
		"php					js/libs/syntaxhighlighter/shBrushPhp.js",
		"plain					js/libs/syntaxhighlighter/shBrushPlain.js",
		"python py 				js/libs/syntaxhighlighter/shBrushPython.js",
		"sql					js/libs/syntaxhighlighter/shBrushSql.js",
		"tt tt2					js/libs/syntaxhighlighter/shBrushTT2.js",
		"yaml yml				js/libs/syntaxhighlighter/shBrushYAML.js"
	);
	SyntaxHighlighter.defaults['toolbar'] = false;
	SyntaxHighlighter.all();

	var resizeBoxes = function(){
		var h = $(window).height() - $('header').innerHeight() - 130;		
		$('.content-area').css('height', (h-20) + 'px');
		$('textarea').css('height', (h - 25) + 'px');		
	};
	
	// resize boxes to fit screen
	resizeBoxes();
	
	// load data from cookie
	$('textarea').val($.cookie('pmee_testdata')).focus();

	$('#submit-count').data('count', 0);	
				
	// bindings
	$(window).resize(resizeBoxes);
	
	$('form').bind("reset", function(){
		$.cookie('pmee_testdata', null);
	});

	
	// post to server
	$('form').submit(function(){
		var testdata = $('textarea').val();
		
		// some processing colors and UI niceness
		$('#result').html('').css('background-color', '#EBF765');
		$('#rawoutput').html('');
		$('button[type=submit]').attr('disabled', 'disabled');
		
		// save testdata in cookie for next reload
		$.cookie('pmee_testdata', testdata, { expires: 7, path: '/demo/' });
		
		// submit and wait for markup
		$.ajax({
			url: './service.php',
			data: { 'markdown': testdata },
			dataType: 'text',
			type: 'POST',
			success: function(res, status, xhr){
				// update UI
				$('#rawoutput').removeClass('prettyprinted');
				$('#result').html(res).css('background-color', 'transparent');
				$('#rawoutput').text(res);
				$('#submit-count').text('#' + ($('#submit-count').data('count') + 1));				
				$('#submit-count').data('count', $('#submit-count').data('count') + 1);
				$('#last-submit').text(new Date().toLocaleString());
				$("#result").find("pre").each(function() {
					SyntaxHighlighter.highlight(SyntaxHighlighter.defaults, this);
				});
				
				prettyPrint();
				$('textarea').focus();
				$('button[type=submit]').removeAttr('disabled');
			}
		});
		return false;
	});
});