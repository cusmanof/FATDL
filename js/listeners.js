/**
 * Add listener on CTRL + S shortcut
 */
AnotherTodoList.addListenerOnKeyboardShortcuts = function() {
	document.observe('keypress', function(e) {
		var code = null;
		if (!e) var e = window.event;
		if (e.keyCode) code = e.keyCode;
		else if (e.which) code = e.which;

		var value = String.fromCharCode(code);

		if (e.ctrlKey && (value == 's' || value == 'S')) {
			AnotherTodoList.save(e);
		}
	});
}

/**
 * Add listener on categories links.
 */
AnotherTodoList.addListenerOnSelectLink = function(link) {
	link.observe('click', AnotherTodoList.activeItemsEvent.bindAsEventListener(link));
}

/**
 * Add listener on help links.
 */
AnotherTodoList.addListenerOnHelpLink = function(link) {
	link.observe('click', AnotherTodoList.displayHelp);
}

/**
 * Add listener on log links.
 */
AnotherTodoList.addListenerOnLogLink = function(link) {
	link.observe('click', AnotherTodoList.displayLog);
}


/**
 * Add listener on ul area.
 */
AnotherTodoList.addListenerOnArea = function(area) {
	area.observe('dblclick', function() {
			AnotherTodoList.addItem( this.down('ul') /* getting parent UL */ );
			document.body.focus();  // cancel out any text selections
		}.bindAsEventListener(area));
	area.observe('mouseover', AnotherTodoList.addAreaAction);
}

/**
 * Add listener on area add action.
 */
AnotherTodoList.addListenerOnAreaAddAction = function(link) {	
	link.observe('click', function(e) {
			AnotherTodoList.addItem( e.element().up('DIV.area').down('ul') /* getting DIV first and then getting UL */ );
			Event.stop(e);
		});
}

/**
 * Add listener on items.
 */
AnotherTodoList.addListenerOnItem = function(listItem) {
	listItem.observe('dblclick', AnotherTodoList.editItem.bindAsEventListener(listItem));
	listItem.observe('mouseover', AnotherTodoList.addItemActions);
}

/**
 * Add listener on edit link action.
 */
AnotherTodoList.addListenerOnItemEditAction = function(link) {
	link.observe('click', function(e) {
		if (AnotherTodoList.currentItemInEdition) {
			AnotherTodoList.currentItemListener(e);
		}
		AnotherTodoList.editItem.bind( e.element().up('li,h2') )(e);
		Event.stop(e);
	});
}

/**
 * Add listener on delete link action.
 */
AnotherTodoList.addListenerOnItemDeleteAction = function(link) {
	link.observe('click', function(e) {
		AnotherTodoList.deleteItem.bind( e.element().up('li,h2') )(e) ;
		Event.stop(e);
	});
}

/**
 * Add listener on indent link action.
 */
AnotherTodoList.addListenerOnItemIndentAction = function(link) {
	link.observe('click', function(e) {
		AnotherTodoList.indentItem.bind( e.element().up('li') )(e);
	});
}

/**
 * Add listener on remove indent link action.
 */
AnotherTodoList.addListenerOnItemRemoveIndentAction = function(link) {
	link.observe('click', function(e) {
		AnotherTodoList.removeIndentItem.bind( e.element().up('li') )(e);
	});
}


/**
 * Add listener on validate edition link action.
 */
AnotherTodoList.addListenerOnItemValidateEditionAction = function(link) {
	link.observe('click', function(e) {
		var input = AnotherTodoList.currentItemInEdition.down('input');
		AnotherTodoList.setValueToInputAndStopObserver(input, input.value);
		Event.stop(e);
	});
}

/**
 * Add listener on cancel edition link action.
 */
AnotherTodoList.addListenerOnItemCancelEditionAction = function(link) {
	link.observe('click', function(e) {
		AnotherTodoList.setValueToInputAndStopObserver(AnotherTodoList.currentItemInEdition.down('input'), AnotherTodoList.currentItemInEdition.originalValue);
		Event.stop(e);
	});
}
