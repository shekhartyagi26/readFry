export default function() {
    const constant = {
        nodeMailer: {
            subject: "Verification Code",
            from: "noreply@fluper.com",
            html: `<!DOCTYPE html><html><head><title>Page Title</title></head><body><h1>Please verify your email address</h1><p><pre>Hi,<br>Please verify your email address so we know that it's really you!.</pre></p><a style="font-size:16px;font-family:Helvetica,Helvetica neue,Arial,Verdana,sans-serif;font-weight:none;color:#ffffff;text-decoration:none;background-color:#3572b0;border-top:11px solid #3572b0;border-bottom:11px solid #3572b0;border-left:20px solid #3572b0;border-right:20px solid #3572b0;border-radius:5px;display:inline-block" class="m_-96280054845025976mobile-button" shape="rect" href="https://www.google.co.in/?gfe_rd=cr&dcr=0&ei=MNKnWfW1LdD08wfA_a3IDw" target="_blank"><span class="il">Verify</span> my email address</a><pre>Happy working,The ReadFry Crew</pre></body></html>`,
            text: "Template",
            passwordMessage: 'New Password Generated'
        }
    };
    return constant;
}