/**
 * Launch load function when window is loaded.
 */
Event.observe(window, 'load', AnotherTodoList.load);

/**
 * Add a trigger on window.unload in order to ask user if workspace should be saved.
 */
Event.observe(window, 'unload', AnotherTodoList.shouldWorkspaceBeSaved);

/**
 * This method is called by AnotherTodoList.load and init actions listeners on many elements.
 */
AnotherTodoList.initializeEvent = function() {

	// Init drag&drop lists
	Sortable.create('firstlist', AnotherTodoList.sortableParam);
	Sortable.create('secondlist', AnotherTodoList.sortableParam);
	Sortable.create('thirdlist', AnotherTodoList.sortableParam);
	Sortable.create('fourthlist', AnotherTodoList.sortableParam);

	// Add action listener on save if not disabled.
	if (!$('save').hasClassName('disabled')) {
		$('save').observe('click', AnotherTodoList.save);
	} else {
		$('save').observe('click', function(e) {
			AnotherTodoList.display(i18n.error501DemoMode, 'warning');
			Event.stop(e);
		});
	}

	// Add action listeners on a.action.select links
	$$('a.action.select').each(AnotherTodoList.addListenerOnSelectLink);

	// Add listener on help button
	AnotherTodoList.addListenerOnHelpLink($('showHelp'));

	// Add action listeners on items
	$$('li').each(AnotherTodoList.addListenerOnItem);

	// Add action listeners on titles
	$$('h2').each(AnotherTodoList.addListenerOnItem);

	// Add action listeners on DIV.area
	$$('div.area').each(AnotherTodoList.addListenerOnArea);

	// Add listener on DIV.area add action
	AnotherTodoList.addListenerOnAreaAddAction($('addLink'));

	// Add listener on items actions
	AnotherTodoList.addListenerOnItemEditAction($('editLink'));
	AnotherTodoList.addListenerOnItemDeleteAction($('deleteLink'));
	AnotherTodoList.addListenerOnItemIndentAction($('indentLink'));
	AnotherTodoList.addListenerOnItemRemoveIndentAction($('removeIndentLink'));
	AnotherTodoList.addListenerOnItemValidateEditionAction($('validateLink'));
	AnotherTodoList.addListenerOnItemCancelEditionAction($('cancelLink'));

	// Add keyboard shortcuts listener
	AnotherTodoList.addListenerOnKeyboardShortcuts();
}

/**
 * Add or remove a class around the selected category and show or hide items
 * for this category (using category's id (i.e. 'pro') against items' classes (i.e. 'pro').
 */
AnotherTodoList.activeItemsEvent = function(e) {

	// Keep current category selected in memory
	AnotherTodoList.user = this.id;

	AnotherTodoList.swapCategory();

	// Toggle class name for each items.
	$$("li").each( function(item) {
		item.toggleClassName("active");
		item.toggleClassName("inactive");
	} );

	Event.stop(e);
}

/**
 * Add a new item.
 */
AnotherTodoList.addItem = function(parentList) {

	var newItem = new Element('li', { 'class': 'item active ' + AnotherTodoList.user}).update(i18n.newItemValue);

	// Add event
	AnotherTodoList.addListenerOnItem(newItem);

	// Add item to list
	parentList.appendChild(newItem);

	// Rebuild the list
	Sortable.create(parentList.id, AnotherTodoList.sortableParam);

	// Inform that the workspace has changed !
	AnotherTodoList.workspaceHasChanged();
}

/**
 * Delete an item.
 */
AnotherTodoList.deleteItem = function(e) { 
	AnotherTodoList.removeItemActions(); // Remove actions because we don't want to remove them !
	this.remove();
	AnotherTodoList.workspaceHasChanged(); // Inform that the workspace has changed !
	Event.stop(e);
}

/**
 * Swith an item in edition mode.
 */
AnotherTodoList.editItem = function(e) {

	/*
	 * If an item is already in edition mode, stop the event.
	 */
	if (AnotherTodoList.currentItemInEdition) {
		Event.stop(e);
		return false;
	}

	// Remove mouse observer
	Event.stopObserving(this, 'mouseover', AnotherTodoList.addItemActions);

	// And remove actions
	AnotherTodoList.removeItemActions();

	var input = new Element('input', { 'class': 'editable ' + this.nodeName.toUpperCase(), 'value': this.innerHTML.unescapeHTML() });
	this.originalValue = this.innerHTML;
	this.innerHTML = "";

	AnotherTodoList.currentItemListener = AnotherTodoList.handleItemKeypressEvent.bindAsEventListener(input);
	AnotherTodoList.currentItemInEdition = this;

	Event.observe(input, 'keypress', AnotherTodoList.currentItemListener);
	Event.observe(document, 'click', AnotherTodoList.currentItemListener);

	this.appendChild(input);

	input.insert( {after: $('editActions').remove().show() } );

	input.focus();
	input.select();

	Event.stop(e);
}

/**
 * Handle key press inside item text input.
 * Enter keypress or a click outside the input remove the input and set the input value on the list item.
 * Escape keypress remove the input and set back the original value.
 */
AnotherTodoList.handleItemKeypressEvent = function(e) {

	if ( ((e.type == 'keypress' || e.type == 'keydown') && e.keyCode == 13 /* enter */ ) ||
			(e.type == 'click' && e.target != this /* Click outside the input */) ) {

		AnotherTodoList.setValueToInputAndStopObserver(this, this.value);
		// Inform that the workspace has changed !
		AnotherTodoList.workspaceHasChanged();

	} if ( (e.type == 'keypress' || e.type == 'keydown') && e.keyCode == 27 /* escape */ ) {

		AnotherTodoList.setValueToInputAndStopObserver(this, this.parentNode.originalValue);
	}
}

/**
 * Set the specified value into the input and stop the associated observer.
 */
AnotherTodoList.setValueToInputAndStopObserver = function(input, value) {

	AnotherTodoList.removeEditActions();

	var listItem = input.parentNode;

	listItem.innerHTML = value.blank() ? "_" : value;
	
	// Stop the event if there's nothing else to do
	Event.stopObserving(document, 'click', AnotherTodoList.currentItemListener);
	AnotherTodoList.currentItemInEdition = null;

	// Add mouse observer
	Event.observe(listItem, 'mouseover', AnotherTodoList.addItemActions);
}

/**
 * Add action on area when mouse hover.
 */
AnotherTodoList.addAreaAction = function(e) {
	var area = $('areaActions');
	area.remove();
	this.insert(area);
	if (!area.visible()) {
		area.show();
	}

	/*
	 * Theses next lines are needed for Internet Explorer to handle other event.
	 * It seems that the mouseover is called in loop and so, IE can't "breathe".
	 * see http://groups.google.com/group/rubyonrails-spinoffs/browse_thread/thread/96cba409d6538693
	 */
	if (AnotherTodoList.lastAreaMouseOver != null) {
		// When mouse will enter another area, we will observe again the last stopped observer.
		AnotherTodoList.lastAreaMouseOver.observe('mouseover', AnotherTodoList.addAreaAction);
	}

	AnotherTodoList.lastAreaMouseOver = this;
	// Stop the current listener (to allow IE to handle next event !)
	AnotherTodoList.lastAreaMouseOver.stopObserving('mouseover', AnotherTodoList.addAreaAction);
}

/**
 * Remove action(s) on area when mouse out and move it on document body (to avoid it to be saved in HTML content).
 */
AnotherTodoList.removeAreaAction = function() {
	var area = $('areaActions');
	area.hide();
	area.remove();
	document.body.insert(area);
}

/**
 * Check if an element is inside 2 lists (UL element).
 */
AnotherTodoList.isAlreadySubList = function(element) {
	return element.hasClassName('sublist');
}

/**
 * Add action(s) on item when mouse hover.
 */
AnotherTodoList.addItemActions = function() {

	// Don't show items actions if another item is in edition
	if (AnotherTodoList.currentItemInEdition) {
		return;
	}

	var isH2 = this.nodeName.toUpperCase() == 'H2';
	var area = $('itemActions');
	var deleteLink = $('deleteLink');
	var indentLink = $('indentLink');
	var removeIndentLink = $('removeIndentLink');

	indentLink.hide();
	removeIndentLink.hide();

	if (isH2) {
		deleteLink.hide();
	} else {
		deleteLink.show();
		if (AnotherTodoList.isAlreadySubList(this)) {
			removeIndentLink.show();
		} else {
			indentLink.show();
		}
	}

	area.remove();
	this.insert(area);
	if (!area.visible()) {
		area.show();
	}

	/*
	 * Theses next lines are needed for Internet Explorer to handle other event : same problem as above on addAreaAction.
	 */
	if (AnotherTodoList.lastItemMouseOver != null) {
		// When mouse will enter another item, we will observe again the last stopped observer.
		AnotherTodoList.lastItemMouseOver.observe('mouseover', AnotherTodoList.addItemActions);
	}

	AnotherTodoList.lastItemMouseOver = this;
	// Stop the current listener (to allow IE to handle next event !)
	AnotherTodoList.lastItemMouseOver.stopObserving('mouseover', AnotherTodoList.addItemActions);
}

/**
 * Remove action(s) on item when mouse hover and move it on document body (to avoid it to be saved in HTML content).
 */
AnotherTodoList.removeItemActions = function() {
	var area = $('itemActions');
	area.hide();
	area.remove();
	document.body.insert(area);
}

/**
 * Indent an item.
 */
AnotherTodoList.indentItem = function(e) {
	var subList = null;

	// Hide item actions
	AnotherTodoList.removeItemActions();

	this.addClassName('sublist');

	// Show item actions
	AnotherTodoList.addItemActions.bind(this)();

	Event.stop(e);
}

/**
 * Remove the indent on an item.
 */
AnotherTodoList.removeIndentItem = function(e) {

	// Hide item actions
	AnotherTodoList.removeItemActions();

	this.removeClassName('sublist');

	// Show item actions
	AnotherTodoList.addItemActions.bind(this)();

	Event.stop(e);
}

/**
 * Remove action(s) on item edition.
 */
AnotherTodoList.removeEditActions = function() {
	var area = $('editActions');
	area.remove();
	area.hide();
	document.body.insert(area);
}


