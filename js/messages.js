/**
 * Display a message in the message zone.
 */
AnotherTodoList.display = function(message, classToUse) {

	AnotherTodoList.emptyMessage();

	var messageBar = $("messagebar");

	if (message.innerHTML) { /* nodeType == Node.ELEMENT_NODE would be better but IE 6 sucks */
		messageBar.update(message.innerHTML);
	} else {
		messageBar.appendChild( new Element('img', {'src':  'img/' + (classToUse == 'error' ? 'error' : 'information') + '.png' }) );
		messageBar.appendChild( new Element('span', {'class': classToUse}).update(message) );
		messageBar.appendChild( new Element('span', {'class': 'date'}).update( new Date().toString() ) );
		AnotherTodoList.isHelpDisplayed = false;
	}

	if (!messageBar.visible()) {
		messageBar.toggle();
	}
}

/**
 * Display the help message.
 */
AnotherTodoList.displayHelp = function(e) {
	if (!AnotherTodoList.isHelpDisplayed) {
		AnotherTodoList.display($("helpMessageContainer"));
	} else {
		AnotherTodoList.closeMessage();
	}
	AnotherTodoList.isHelpDisplayed = !AnotherTodoList.isHelpDisplayed;

	Event.stop(e);
}

AnotherTodoList.closeMessage = function() {
	AnotherTodoList.emptyMessage();
	$("messagebar").toggle();
}

AnotherTodoList.emptyMessage = function() {
	$("messagebar").update("");
}


/**
 * Common method to show a standard error message related to an Ajax problem.
 * Also, the server error is diplayed.
 */
AnotherTodoList.showAjaxProblem = function(xhr) {
	if (xhr) {
		AnotherTodoList.display(i18n.problemOnAjaxRequest + " " + i18n.serverSent + " : [" + xhr.status + " - " + xhr.responseText + "]", "error");
	} else {
		AnotherTodoList.display(i18n.problemOnAjaxRequest, "error");
	}
}

