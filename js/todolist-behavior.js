/*
 * Main namespace
 */
var AnotherTodoList = function() {};

/**
 * Personnal category
 */
AnotherTodoList.categoryPersonal = 'perso';

/**
 * Professional category
 */
AnotherTodoList.categoryProfessional = 'pro';

/**
 * Default selected category
 */
AnotherTodoList.selectedCategory = null;

/**
 * Switch used to know if help is displayed or not
 */
AnotherTodoList.isHelpDisplayed = false;

/**
 * Common sortable list parameters
 */
AnotherTodoList.sortableParam = { 	dropOnEmpty: true,
									containment: ["firstlist","secondlist","thirdlist","fourthlist"],
									constraint: false,
									onUpdate: function(element) {
										AnotherTodoList.workspaceHasChanged(); // Inform that the workspace has changed !
									}
								};

/**
 * Current item listener (used to close edition box later)
 */
AnotherTodoList.currentItemListener = null;

/**
 * Current item (<li>) in edition (used to close edition box later)
 */
AnotherTodoList.currentItemInEdition = null;

/**
 * Switch used to know if the user has just made a change
 */
AnotherTodoList.hasTheWorkspaceChanged = false;

/**
 * Last area wich has been "mouse overed" !
 */
AnotherTodoList.lastAreaMouseOver = null;

/**
 * Last items wich has been "mouse overed" !
 */
AnotherTodoList.lastItemMouseOver = null;

/**
 * Save the current values in the current workspace by Ajax => PHP => MySQL.
 */
AnotherTodoList.save = function(e) {

	if ( $F( 'workspace' ) ) {

		AnotherTodoList.display(i18n.saving, "info");

		// If an item is in edition mode, close it before saving
		if (AnotherTodoList.currentItemInEdition) {
			AnotherTodoList.setValueToInputAndStopObserver(AnotherTodoList.currentItemInEdition.firstChild, AnotherTodoList.currentItemInEdition.firstChild.value);
		}

		// Remove actions on area or items
		AnotherTodoList.removeAreaAction();
		AnotherTodoList.removeItemActions();

		new Ajax.Request('php/save.php', {
			method: 'post',
			parameters: { workspace: $F( 'workspace' ), selectedCategory: AnotherTodoList.selectedCategory, 
							list1: $('first').innerHTML, list2: $('second').innerHTML, 
							list3: $('third').innerHTML, list4: $('fourth').innerHTML },
			onFailure: AnotherTodoList.showAjaxProblem,
			onSuccess: function(xhr) {
				AnotherTodoList.hasTheWorkspaceChanged = false;
				AnotherTodoList.display(i18n.savedOk, "info");
			}
		});

	} else {
		AnotherTodoList.display(i18n.errorMessageIfProblemWhileSaving, "error");
	}
	Event.stop(e);
}

/**
 * If a workspace is defined, load the workspace by Ajax => PHP => MySQL.
 * If no workspace is defined, init the application.
 */
AnotherTodoList.load = function() {
	if ( $F( 'workspace' ) ) {

		AnotherTodoList.display(i18n.loading, "info");

		new Ajax.Request('php/load.php', {
			method: 'get',
			parameters: { workspace: $F( 'workspace' ) },
			on404: function() {
				AnotherTodoList.initApplicationIfNoCategoryAreDefined();
				AnotherTodoList.display(i18n.errorWorkspaceNotFound, "info");
			},
			on501: function() {
				AnotherTodoList.initApplicationIfNoCategoryAreDefined();
				AnotherTodoList.display(i18n.error501DemoMode, "warning");
			},
			onFailure: function(xhr) {
				AnotherTodoList.initApplicationIfNoCategoryAreDefined();
				AnotherTodoList.showAjaxProblem(xhr);
			},
			onSuccess: function(xhr) {

				var workspace = eval('(' + xhr.responseText + ')');

				AnotherTodoList.selectedCategory = workspace.selectedCategory;
				AnotherTodoList.selectCategory();

				$('first').innerHTML = workspace.list1;
				$('second').innerHTML = workspace.list2;
				$('third').innerHTML = workspace.list3;
				$('fourth').innerHTML = workspace.list4;

				AnotherTodoList.hasTheWorkspaceChanged = false;

				AnotherTodoList.display(i18n.loadedOk, "info");
			},
			onComplete: function() {
				/* At least, load events */
				AnotherTodoList.initializeEvent();
			}
		});

	} else {
		AnotherTodoList.initApplicationIfNoCategoryAreDefined();
		AnotherTodoList.display(i18n.errorMessageIfProblemWhileLoading, "error");
		// At least, load events.
		AnotherTodoList.initializeEvent();
	}
}

/**
 * Ask the user if the workspace should be saved or not.
 */
AnotherTodoList.shouldWorkspaceBeSaved = function(e) {
	if (AnotherTodoList.hasTheWorkspaceChanged && confirm(i18n.askUserIfWorkspaceMustBeSaved)) {
		AnotherTodoList.save(e);
	}
}


/**
 * Init the application : select a default category and activate it.
 */
AnotherTodoList.initApplicationIfNoCategoryAreDefined = function() {
	AnotherTodoList.selectedCategory = AnotherTodoList.categoryPersonal;
	AnotherTodoList.selectCategory();
}


/**
 * Select the category according to AnotherTodoList.selectedCategory.
 */
AnotherTodoList.selectCategory = function() {
	if (!AnotherTodoList.selectedCategory) {
		AnotherTodoList.display(i18n.noSelectedCategory, "error");
		return;
	}
	$$('a.action.select').each( function(link) {
		if (link.id == AnotherTodoList.selectedCategory) {
			link.addClassName("active");
			link.removeClassName("inactive");
		} else {
			link.addClassName("inactive");
			link.removeClassName("active");
		}
	} );

	$$('div.area h2').each( function(title) {
		if (title.hasClassName( AnotherTodoList.selectedCategory )) {
			title.addClassName("active");
			title.removeClassName("inactive");
		} else {
			title.addClassName("inactive");
			title.removeClassName("active");
		}
	} );

}


/**
 * Swap between the 2 categories (active the first & inactivate the second and so on).
 */
AnotherTodoList.swapCategory = function() {
	// Change CSS classes on links
	$$('a.action.select').each( function(link) {
		link.toggleClassName("active");
		link.toggleClassName("inactive");
	} );
	// Change CSS classes on titles
	$$('div.area h2').each( function(title) {
		title.toggleClassName("active");
		title.toggleClassName("inactive");
	} );
}

/**
 * Called when the workspace has changed !
 */
AnotherTodoList.workspaceHasChanged = function() {
	AnotherTodoList.hasTheWorkspaceChanged = true;
	AnotherTodoList.display(i18n.workspaceHasChanged, "info");
}
