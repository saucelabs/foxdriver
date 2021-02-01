How to use self-signed certificate in Firefox
=========

### Steps
- Open up firefox with a default or user profile: `firefox -P <user_profile_name>`
- Browse to `about:preferences#privacy` and click on `View Certificates`
- Go to `Authorities` tab and click on import. Now import your root CA
- Browse to `about:profiles` and find your profile's folder
- Copy the `cert9.db` or `cert8.db` (older versions) to your location of choise
- in `Foxdriver.launch` use the `customProfileFiles` flag to add your file to the profile folder


### More Reading
- [How to Create Your Own SSL Certificate Authority for Local HTTPS Development](https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/)
- [Profiles - Where Firefox stores your bookmarks, passwords and other user data](https://support.mozilla.org/en-US/kb/profiles-where-firefox-stores-user-data)