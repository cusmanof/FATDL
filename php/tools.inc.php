<?php

	function prepSqlValue($val) {
		return (!$val) ? "\"\"" :  "\"".addslashes(utf8_decode(trim($val)))."\"";
	}

	function prepShowValue($val) {
		return (!$val) ? "" :  stripslashes(utf8_encode(trim($val)));
	}

	function prepJSONValue($val) {

		$riskyChar	 	= array("\n", "\r", "\t");

		return (!$val) ? "\"\"" :  "\"".str_replace($riskyChar, "", utf8_encode(trim($val)))."\"";
	}

	function prepWorkspace($val) {
		return (!$val) ? "" :  stripslashes(utf8_encode(preg_replace( "[^a-zA-Z1-9.]", "", $val)));
	}

	function terminateWithError($HttpErrorcode, $errorMessage) {
		$errorLists = array( 	404 => "Not Found",
								500 => "Internal Server Error",
								501 => "Not implemented" );

		header( "HTTP/1.1 " . $HttpErrorcode . " " . $errorLists[$HttpErrorcode] );
		die( $errorMessage );
	}
?>
