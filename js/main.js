$(document).ready(function() {	
	var recaptcha1;
	var recaptcha2;
	var CaptchaCallback1 = function() { recaptcha1 = grecaptcha.render('RecaptchaField1', {'sitekey' : '6LfDB34UAAAAABoC-9OH2WvVylwqILVcnlrmYBQj'}); };
	var CaptchaCallback2 = function() { recaptcha2 = grecaptcha.render('RecaptchaField2', {'sitekey' : '6LfDB34UAAAAABoC-9OH2WvVylwqILVcnlrmYBQj'}); };
		
	if(window.location.hash.substr(1) == 'rules'){
		$('html, body').animate({
			scrollTop: $("#rules").offset().top
		}, 500);
	}
	
	/* slider start */
	const hslider = $('#hslider');
	if ($('.slide', hslider).length > 1) {
		$('.slideshow', hslider).bxSlider({
			auto: true,
			autoHover: true,
			mode: 'fade',
			speed: 1000
		});
	}
	/* slider end */
});

$(document).on("click", "[data-submit-login]", function(e) {
	$(this).blur();
	e.preventDefault();
	login = $('input[id=newLogin]').val();
	passwd = $('input[id=newPasswd]').val();
	fa2code = $('input[id=fa2code]').val();
	$.post("//"+document.domain+"/public/login.php", { 'login': login, 'passwd': passwd, 'fa2code': fa2code }, function(json){
		data = JSON.parse(json);
		if(data.err == 'ok'){
			document.location.href="/";
		}else{
			$("#loginMes").html("(<font color=red>"+data.mes+"</font>)");
		}
	});
});

$(document).on("click", "[data-submit-register]", function(e) {
	$(this).blur();
	e.preventDefault();
	var submit = $(this);
	var mail = $('input[id=regEmail]').val();
	var login = $('input[id=regLogin]').val();
	submit.hide(); // recaptchav3 has some delay
	if($("div#RecaptchaField1").css('display') == 'none'){
		grecaptcha.execute('6LfA2mUUAAAAAAbcTyBWyTXV2Kp6vi247GywQF1A').then(function(token) {
			$.post("//"+document.domain+"/public/registration.php", { 'login': login, 'mail': mail, 'g-recaptcha-response': token }, function(json){
				data = JSON.parse(json);
				color = 'green';
				if(data.err != 'ok'){
					color = 'red';
					if(data.mes == 'reCaptcha test failed: score too low'){
						$("div#RecaptchaField1").show();
						$.getScript("https://www.google.com/recaptcha/api.js?onload=CaptchaCallback1&render=explicit");
					}
					submit.show();
				}
				$("#regMes").html("(<font color="+color+">"+data.mes+"</font>)");
			});
		});
	}else{
		$.post("//"+document.domain+"/public/registration.php", { 'login': login, 'mail': mail, 'g-recaptcha-response': grecaptcha.getResponse(recaptcha1), 'recaptcha': 2 }, function(json){
			console.log(json);
			data = JSON.parse(json);
			color = 'green';
			if(data.err == 'ok'){
				$("div#RecaptchaField1").hide();
			}
			if(data.err != 'ok'){
				color = 'red';
				grecaptcha.reset(recaptcha1);
				submit.show();
			}
			$("#lostMes").html("(<font color="+color+">"+data.mes+"</font>)");
		});
	}
});

$(document).on("click", "[data-submit-passwdrecovery]", function(e) {
	$(this).blur();
	e.preventDefault();
	var submit = $(this);
	var mail = $('input[id=lostEmail]').val();
	submit.hide(); // recaptchav3 has some delay
	if($("div#RecaptchaField2").css('display') == 'none'){
		grecaptcha.execute('6LfA2mUUAAAAAAbcTyBWyTXV2Kp6vi247GywQF1A').then(function(token) {
			$.post("//"+document.domain+"/public/password_recovery.php", { 'mail': mail, 'g-recaptcha-response': token }, function(json){
				data = JSON.parse(json);
				color = 'green';
				if(data.err != 'ok'){
					color = 'red';
					if(data.mes == 'reCaptcha test failed: score too low'){
						$("div#RecaptchaField2").show();
						$.getScript("https://www.google.com/recaptcha/api.js?onload=CaptchaCallback2&render=explicit");
					}
					submit.show();
				}
				$("#lostMes").html("(<font color="+color+">"+data.mes+"</font>)");
			});
		});
	}else{
		$.post("//"+document.domain+"/public/password_recovery.php", { 'mail': mail, 'g-recaptcha-response': grecaptcha.getResponse(recaptcha2), 'recaptcha': 2 }, function(json){
			data = JSON.parse(json);
			color = 'green';
			if(data.err == 'ok'){
				$("div#RecaptchaField2").hide();
			}
			if(data.err != 'ok'){
				color = 'red';
				grecaptcha.reset(recaptcha1);
				submit.show();
			}
			$("#lostMes").html("(<font color="+color+">"+data.mes+"</font>)");
		});
	}
});

$(document).on("click", "[data-2fa-generate]", function(e) {
	var _this = $(this);
	_this.blur();
	e.preventDefault();
	$.post("//"+document.domain+"/public/2fa.php", {do: 'gen'}, function(json){
		data = JSON.parse(json);
		if(data.err == 'ok'){
			_this.hide();
			$("#2fakey").html(data.mes);
		}
	});
});

$(document).on("click", "[data-2fa-start]", function(e) {
	$(this).blur();
	e.preventDefault();
	secret = $('input[id=2fa]').val();
	check = $('input[id=2facheck]').val();
	passwd = $('input[id=2fapasswd]').val();
	$.post("//"+document.domain+"/public/2fa.php", {do: 'save', '2fa': secret, code: check, passwd: passwd}, function(json){
		data = JSON.parse(json);
		color = 'red';
		if(data.err == 'ok'){
			color = 'green';
			if(data.key == '2FAenabled'){
				$("#send2fa").val('Выключить 2FA');
				$("div#2fagen").hide();
			}else{
				$("#send2fa").val('Включить 2FA');
				$("div#2fagen").show();
			}
			$("#2facheck").val('');
			$("#2fapasswd").val('');
		}
					
		$("#2faMes").html("(<font color="+color+">"+data.mes+"</font>)");
	});
});


$(document).on("click", "[data-change-email]", function(e) {
	$(this).blur();
	e.preventDefault();
	mail = $('input[id=changeEmail]').val();
	passwd = $('input[id=changeEmailPasswd]').val();
	$.post("//"+document.domain+"/public/change_mail.php", {'mail': mail, 'passwd': passwd }, function(json){
		data = JSON.parse(json);
		color = 'red';
		if(data.err == 'ok'){
			color = 'green';
		}
		$("#changeEmailMes").html("(<font color="+color+">"+data.mes+"</font>)");
	});
});


$(document).on("click", "[data-change-passwd]", function(e) {
	$(this).blur();
	e.preventDefault();
	passwd = $('input[id=changePasswd]').val();
	$.post("//"+document.domain+"/public/change_passwd.php", {'passwd': passwd }, function(json){
		data = JSON.parse(json);
		color = 'red';
		if(data.err == 'ok'){
			color = 'green';
		}
		$("#changePasswdMes").html("(<font color="+color+">"+data.mes+"</font>)");
	});
});

