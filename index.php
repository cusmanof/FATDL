<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
    <head>
        <?php require_once("header.inc.php"); ?>

        <link rel="stylesheet" type="text/css" href="css/index.css" media="all"/>
        <script type="text/javascript" src="js/lib/prototype.js"></script>
        <script type="text/javascript" src="js/index-behavior.js"></script>
    </head>
    <body>
        <div id="content">
            <h1>Another To-do List</h1>



            <?php
            require_once("php/db.inc.php");
            echo '<form action="application.php" method="get">';
            $ww = getWorkspaces();
            echo "Workspaces : ";
            foreach ($ww as $ws) {
                echo ' <input  type="submit" name="workspace" value="' . $ws . '" /> ';
            }
            echo'</form>';
            ?>
            <div id="sidebar">
                <form action="application.php" method="get">
                    <fieldset id="workspaceSelection">
                        <legend>Create a workspace</legend>
                        <label for="workspace">Workspace</label> : <input type="text" name="workspace" id="workspace" value="" maxlength="8"/>
                        <input type="submit" value="new"/>
                    </fieldset>
                </form>

            </div>
            <?php
            require_once("footer.inc.php");
            ?>
        </div>   
    </body>
</html>
