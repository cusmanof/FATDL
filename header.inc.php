<?php
	require_once("php/properties.inc.php");
?>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Another To-do list</title>
<?php if (!DEMO_MODE) { /* If you deploy the application on your server, I assume that you don't want to be registered by robots */ ?>
	<meta name="robots" content="noindex,nofollow"/>
<?php } else { ?>
	<meta name="keywords" content="To-do List,task,website,project management,application,javascript,ajax,script.aculo.us,prototypejs,opensource,open source,web 2.0,gpl,PAUL,Gr&eacute;gory"/>
<?php } ?>
	<meta name="author" content="Gr&eacute;gory Paul"/>
	<meta name="description" content="Another To-do List"/>
	<link rel="stylesheet" type="text/css" href="css/common.css" media="screen"/>
