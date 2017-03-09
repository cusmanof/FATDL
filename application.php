<?php
require_once("php/tools.inc.php");
$workspace = "";
if (isset($_GET['workspace'])) {
    $workspace = prepWorkspace($_GET['workspace']);
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
    <head>
        <?php require_once("header.inc.php"); ?>
        <link rel="stylesheet" type="text/css" href="css/application-screen.css" media="screen"/>
        <link rel="stylesheet" type="text/css" href="css/application-print.css" media="print"/>
        <!--[if lte IE 6]>
        <link rel="stylesheet" type="text/css" href="css/application-screen-IE.css" media="screen"/>
        <![endif]-->
        <script type="text/javascript" src="js/lib/prototype.js"></script>
        <script type="text/javascript" src="js/lib/scriptaculous.js"></script>
        <script type="text/javascript" src="js/i18n.js"></script>
        <script type="text/javascript" src="js/todolist-behavior.js"></script>
        <script type="text/javascript" src="js/messages.js"></script>
        <script type="text/javascript" src="js/listeners.js"></script>
        <script type="text/javascript" src="js/events.js"></script>
    </head>
    <body>
        <div id="toolbar">
            <a href="" id="showHelp" class="action toggleHelp" title="show application help" />
            <span id="workspaceSelection"><label for="workspace">workspace</label> : <input type="text" id="workspace" disabled="disabled" value="<?php echo $workspace; ?>"/></span>
            <span class="separator">|</span>
            <a href="" id="save" class="action" title="save your modifications">save</a>
        </div>
        <div id="helpMessageContainer">
            <div id="helpMessage">
                <h2><img src="img/help.png" alt="help" />Another To-do List help</h2>
                <p>This application allows you to manage your to-do lists.</p>
                <p>You can <span class="highlight">create</span> new items by using the 'plus' icon or by a double-click inside one of the four areas.</p>
                <p>To <span class="highlight">edit</span> an existant item or a category title, just use the 'edit' icon or double click on it, type your text and press the <tt>enter</tt> key to validate it or the <tt>escape</tt> key to cancel your modification.</p>
                <p>You can <span class="highlight">move</span> your items by drag-and-dropping them from one area to another one.</p>
                <p>You can also <span class="highlight">delete</span> an item by clicking on the 'delete' icon.</p>
                <p>You may <span class="highlight">indent</span> an item by using the 'indent' icon. You could then use the 'remove indent' icon to un-indent it.</p>
                <p>Hit the <span class="highlight">save</span> button if you want to save your modifications.</p>
                <p>On Firefox, use shortcut <tt>Control</tt> + <tt>S</tt> to save.</p>
                <p>Please also note that you can <span class="highlight">switch</span> between the <span class="perso">personal</span> or <span class="pro">professional</span> category.</p>
                <p>You may close that message by hitting again the <span class="highlight">help</span> button.</p>
            </div>
        </div>
        <div id="messagebar">
            Welcome to Another To-do List !
        </div>
        <div id="first" class="area top left">
            <h2 class="perso">Category 1</h2>
            <h2 class="pro inactive">Category 1</h2>
            <ul id="firstlist"></ul>
        </div>
        <div id="second" class="area top right">
            <h2 class="perso">Category 2</h2>
            <h2 class="pro inactive">Category 2</h2>
            <ul id="secondlist"></ul>
        </div>
        <div id="third" class="area bottom left">
            <h2 class="perso">Category 3</h2>
            <h2 class="pro inactive">Category 3</h2>
            <ul id="thirdlist"></ul>
        </div>
        <div id="fourth" class="area bottom right">
            <h2 class="perso">Category 4</h2>
            <h2 class="pro inactive">Category 4</h2>
            <ul id="fourthlist"></ul>
        </div>
        <span id="areaActions" style="display: none;">
            <a href="" id="addLink" class="action" title="add an item in the category"><img src="img/add.png" alt="add an item" /></a>
        </span>
        <span id="itemActions" style="display: none;">
            <a href="" id="editLink" class="action" title="edit the current item"><img src="img/pencil.png" alt="edit" /></a>
            <a href="" id="deleteLink" class="action" title="delete the current item"><img src="img/cross.png" alt="delete" /></a>
            <a href="" id="indentLink" class="action" style="display: none;" title="indent that item"><img src="img/text_indent.png" alt="indent" /></a>
            <a href="" id="removeIndentLink" class="action" style="display: none;" title="remove the indent for that item"><img src="img/text_indent_remove.png" alt="remove indent" /></a>
        </span>
        <span id="editActions" style="display: none;">
            <a href="" id="validateLink" class="action" title="validate the text typed"><img src="img/tick.png" alt="validate" /></a>
            <a href="" id="cancelLink" class="action" title="cancel and revert to last text"><img src="img/cancel.png" alt="cancel" /></a>		
        </span>
        <div id="footer"></div>
        <span>
            <BR></BR>
            <div id="toolbar">
                <?php
                require_once("php/db.inc.php");
                echo '<form action="application.php" method="get">';
                $ww = getWorkspaces();
                echo "Workspaces : ";
                foreach ($ww as $ws) {
                    echo ' <input style="width:5em" type="submit" name="workspace" value="' . $ws . '" /> ';
                }
                echo'</form>';
                ?>
            </div>
        </span>
        <?php require_once("footer.inc.php"); ?>

    </body>
</html>

