//
// Cryptii
// Conversion
// Navajo code format
//

(function($, cryptii) {
	
	"use strict";

	var format = {

		title: 'Navajo code',
		category: 'Alphabet',
		url: 'https://en.wikipedia.org/wiki/Navajo_code',

		alphabet: {

			// alphabet
			'A': ['WOL-LA-CHEE'],
			'B': ['SHUSH'],
			'C': ['MOASHI'],
			'D': ['BE'],
			'E': ['DZEH'],
			'F': ['MA-E'],
			'G': ['KLIZZIE'],
			'H': ['LIN'],
			'I': ['TKIN'],
			'J': ['TKELE-CHO-GI'],
			'K': ['KLIZZIE-YAZZI'],
			'L': ['DIBEH-YAZZI'],
			'M': ['NA-AS-TSO-SI'],
			'N': ['NESH-CHEE'],
			'O': ['NE-ASH-JAH'],
			'P': ['BI-SODIH'],
			'Q': ['CA-YEILTH'],
			'R': ['GAH'],
			'S': ['DIBEH'],
			'T': ['THAN-ZIE'],
			'U': ['NO-DA-IH'],
			'V': ['A-KEH-DI-GLINI'],
			'W': ['GLOE-IH'],
			'X': ['AL-NA-AS-DZOH'],
			'Y': ['TSAH-AS-ZIH'],
			'Z': ['BESH-DO-TLIZ'],

		},

		flippedAlphabet: null,

		interpret: {
			options: {

			},
			run: function(conversion, options)
			{
				// collect information
				var formatDef = cryptii.conversion.formats['navajo'];
				var alphabet = formatDef.alphabet;

				// flip alphabet if not done already
				formatDef.flippedAlphabet = {};

				$.each(alphabet, function(key, values)
				{
					if (typeof values == 'string')
						// add single value
						formatDef.flippedAlphabet[values] = key;
					else
						// add all values
						$.each(values, function(index, value) {
							formatDef.flippedAlphabet[value] = key;
						});
				});

				var flippedAlphabet = formatDef.flippedAlphabet;

				var words = conversion.content.split(' ');
				var result = '';

				$.each(words, function(index, word)
				{
					var wordResult = flippedAlphabet[word];
					
					if (wordResult != undefined)
						// append translated word
						result += wordResult;
				});

				// create splitted content table by interpreting result as text
				var textConversion = cryptii.conversion.convert(
					result, {
						interpret: { format: 'text' },
						convert: null
					});

				// using this method, this is splitted converted
				conversion.isSplittedContentConversion = true;
				conversion.splittedContent = textConversion.splittedContent;
			}
		},
		
		convert: {
			options: {

			},
			run: function(conversion, options)
			{
				// this can't be splitted content converted
				conversion.isSplittedContentConversion = false;

				// collect information
				var formatDef = cryptii.conversion.formats['navajo'];
				var alphabet = formatDef.alphabet;

				// first convert content to text
				var text = cryptii.conversion.convert(
					conversion.content, {
						interpret: conversion.options.interpret,
						convert: { format: 'text' }
					}).result;

				// uppercase text
				text = text.toUpperCase();

				// split text into its words
				var words = text.split(' ');
				var result = '';

				$.each(words, function(index, word)
				{
					var resultWord = alphabet[word];

					if (resultWord == undefined || word.length == 1)
					{
						// no navajo word entry matched
						resultWord = '';

						$.each(word.split(''), function(index, letter)
						{
							var letterResults = alphabet[letter];

							// add space separator
							if (resultWord != '')
								resultWord += ' ';

							if (letterResults != undefined)
								// append random result from alphabet entry
								resultWord += letterResults[parseInt(
									Math.random() * letterResults.length)];

						});
					}

					// add separator (and navajo space)
					if (result != '')
						result += ' ' + alphabet[' '] + ' ';

					// add word
					result += resultWord;

				});

				// pass result
				conversion.result = result;
			}
		}

	};

	// register format
	cryptii.conversion.registerFormat('navajo', format);

})($, cryptii);
