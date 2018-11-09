// XXX: This is completely idiotic. These templates should be stored in separate
// files. Unfortunately, Serverless, or maybe the serverless webpack plugin,
// does not seem to provide a non-broken mechanism for adding resource files to
// a Lambda bundle — or, at least, finding such a beast exceeds my meagre web
// and StackOverflow search abilities. The research I conducted yielded little
// of use:
//
// - https://serverless.com/framework/docs/providers/aws/guide/packaging/ —
//   official Serverless documentation — does not work
// - https://forum.serverless.com/t/package-excludes-do-not-seem-to-work/2314 —
//   weird semantics, problem reported before, maybe the serverless webpack
//   plugin breaks it
//
// So, to work around this, I am providing the templates in code which,
// presumably, the packaging system will pick up. Yay.


const templates: {[key: string]: string} = {

  html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <title></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <style type="text/css">
     @media only screen and (max-width:580px){
       .m_device_width100P {
	 width:100%!important;
	 min-width:100%!important;
	 height:auto!important;
       }
       .m_db {
	 display:block!important;
       }
       .mob-OuterPad10 {
	 padding:0px 10px 0px 10px!important;
       }
       .mob-ptb75lr35 {
	 padding:75px 35px 75px 35px!important;
       }
       .mob-ptb0lr35 {
	 padding:0px 35px 0px 35px!important;
       }
     }
    </style>
  </head>

  <body style="margin:0px; padding:0px; background-color:#f5f5f5">
    <div style="margin:0px; padding:0px; background-color:#f5f5f5;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#f5f5f5;">
	<tr>
	  <td align="center">
	    <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#f5f5f5" class="m_device_width100P">
	      <tr>
		<td align="center" class="mob-OuterPad10">
		  <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" style="background:#f5f5f5" class="m_device_width100P">
		    <tr>
		      <td align="center" style="padding:32px 0px 32px 0px;">
			<table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" class="m_device_width100P">
			  <tr>
			    <td align="left" valign="top" width="40">
			      <a href="https://###DOMAIN###/" target="_blank" style="color:#c83a6e; text-decoration:none;">
				<img align="center" src="https://precisionhealth.site/static/media/precisely-icon.png" alt="" border="0" width="40" height="40" style="width:40px; max-width:40px;">
			      </a>
			    </td>
			    <td align="left" valign="middle" style="padding:0px 0px 0px 10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:40px; font-weight:normal; color:#c83a6e; line-height:40px; text-align:left;">
			      <a href="https://###DOMAIN###/" target="_blank" style="color:#c83a6e; text-decoration:none;">Precise.ly</a>
			    </td>
			  </tr>
			</table>
		      </td>
		    </tr>
		  </table>
		</td>
	      </tr>
	      <tr>
		<td align="center" class="mob-OuterPad10">
		  <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff; box-shadow: 0 2px 29px -8px rgba(192, 79, 127, 0.51);" class="m_device_width100P">
		    <tr>
		      <td align="center" style="padding:75px 35px 75px 35px;" class="mob-ptb75lr35">
			<table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff" class="m_device_width100P">
			  <tr>
			    <td align="center" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:28px; font-weight:normal; color:#4a4a4a; line-height:28px; text-align:center; display:block;">
			      ###SUBJECT###
			    </td>
			  </tr>
			  <tr>
			    <td align="center" style="padding:40px 0px 55px 0px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:16px; font-weight:normal; color:#999999; line-height:22px; text-align:center; display:block;">
			      ###LINE1###<br/><br/>
			      ###LINE2###
			    </td>
			  </tr>
			  <!-- Button Start Here -->
			  <tr>
			    <td align="center">
			      <table align="center" border="0" cellspacing="0" cellpadding="0">
				<tr>
				  <td align="center" style="background:#2b3fe0; border-radius:4px; display:block;">
				    <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0">
				      <tr>
					<td style="padding:5px 20px 5px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:16px; font-weight:normal; color:#ffffff; line-height:24px; text-align:center; display:block; cursor:pointer">
					  <a href="https://###DOMAIN###/" style="color:#ffffff;text-decoration:none;">###LINK###</a>
					</td>
				      </tr>
				    </table>
				  </td>
				</tr>
			      </table>
			    </td>
			  </tr>
			  <!-- Button End Here -->
			</table>
		      </td>
		    </tr>
		  </table>
		</td>
	      </tr>
	    </table>
	  </td>
	</tr>
	<tr>
	  <td align="center" style="padding:35px 0px 35px 0px;">
	    <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#f5f5f5" class="m_device_width100P">
	      <tr>
		<td align="center" class="mob-OuterPad10">
		  <table align="center" width="650" border="0" cellspacing="0" cellpadding="0" style="background:#f5f5f5" class="m_device_width100P">
		    <tr>
		      <td align="center" style="padding:0px 35px 0px 35px" class="mob-ptb0lr35">
			<table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" class="m_device_width100P">
			  <tr>
			    <td align="center" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:16px; font-weight:normal; color:#9d9d9d; line-height:22px; text-align:center; display:block;">
			      <a href="https://###DOMAIN###/privacy-policy" style="color:#9d9d9d; text-decoration:none;" target="_blank">Privacy Policy</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://###DOMAIN###/tos" style="color:#9d9d9d; text-decoration:none;" target="_blank">Terms of Service</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#9d9d9d; text-decoration:none;">&copy; 2018 Precise.ly</span>
			    </td>
			  </tr>
			</table>
		      </td>
		    </tr>
		  </table>
		</td>
	      </tr>
	    </table>
	  </td>
	</tr>
      </table>
    </div>
  </body>

</html>
  `,

  // text email template
  text: `
###LINE1###

###LINE2###

https://###DOMAIN###
  `

};


export default templates;
