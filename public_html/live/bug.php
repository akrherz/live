<?php
/*
 * Email debug log to daryl
 */
 include("../../include/props.php");
 include("../../include/utils.php");
 $data = isset($_REQUEST["data"]) ? $_REQUEST["data"] : die("no data");
 $user = isset($_REQUEST["user"]) ? $_REQUEST["user"] : die("no user");
 
    $mail = new NWSChat_Mail();
    $mail->setBodyHtml($data);
    $mail->setSubject("Live Debug Log - $user");
    $mail->setFrom(NWSCHATADMIN);
    $mail->addTo('daryl.herzmann@noaa.gov');
    $mail->send();

	 echo "Thank you! Logs sent...";

?>