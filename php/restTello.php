<?php
	$req_typ = $_SERVER['REQUEST_METHOD'];
	
	if(isset($_SERVER['PATH_INFO']))
	{	$req_path=$_SERVER['PATH_INFO'];
		$req_data=explode('/',$req_path);
	}
	if($req_typ=='POST'){
		if(isset($req_data[1])&&$req_data[1]=='vol')
		{	
			$data_json = json_decode(file_get_contents("php://input"), true);
			print_r($data_json);
		}
	}
?>
