<?php 
/*
 * Need to be able to proxy some stuff for Live, so to avoid cross domain
 */
include("../../include/props.php");
include_once "../../include/utils.php";
$URLS = Array(
 0 => "http://www.wpc.ncep.noaa.gov/kml/qpf/QPF24hr_Day1_latest_netlink.kml",
 1 => "http://www.wpc.ncep.noaa.gov/kml/qpf/QPF24hr_Day2_latest_netlink.kml",
 2 => "http://www.wpc.ncep.noaa.gov/kml/qpf/QPF120hr_Day1-5_latest_netlink.kml",
 3 => "http://www.spc.noaa.gov/products/outlook/day1otlk.kml",
 4 => "http://www.spc.noaa.gov/products/outlook/day2otlk.kml",
 5 => "http://www.spc.noaa.gov/products/outlook/day3otlk.kml",
 6 => "http://www.spc.noaa.gov/products/exper/day4-8/day4prob.kml",
 #7 => "http://www.wrh.noaa.gov/zse/gm/makeairsigkml.php?param=convect",
 7 => "http://mesonet.agron.iastate.edu/geojson/convective_sigmet.php",
 );
$id = isset($_REQUEST['id']) ? intval($_REQUEST['id']) : die('No ID Set');

if (array_key_exists($id, $URLS)){
	$datar = curl_get( $URLS[$id] );
	echo $datar;
	return;
}

?>