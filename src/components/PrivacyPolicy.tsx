import React, { useEffect, useState } from 'react';

export default function PrivacyPolicy() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('peps_privacy_content');
    if (saved) {
      setContent(saved);
    }
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-16 text-left font-sans">
        
        {/* Top small header */}
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">
          PRIVACY POLICY
        </span>

        {/* Big title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B1E33] tracking-tight font-montserrat mb-4 uppercase">
          PRIVACY POLICY
        </h1>

        {/* Small italicized line */}
        <p className="text-gray-500 text-sm italic mb-10">
          See our Privacy Policy
        </p>

        {/* Content body split into segments */}
        {content ? (
          <div className="text-[#4A5568] text-[13.5px] leading-relaxed whitespace-pre-wrap font-sans">
            {content}
          </div>
        ) : (
          <div className="space-y-8 text-[#4A5568] text-[13.5px] leading-relaxed">
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#0B1E33] font-montserrat tracking-tight">
                Who we are
              </h2>
              <p>
                Our website address is: <span className="text-[#DE5246] underline font-medium">https://buyswisspeptides.shop</span>
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#0B1E33] font-montserrat tracking-tight">
                Comments
              </h2>
              <p>
                When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.
              </p>
              <p>
                An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: <a href="https://automattic.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-[#DE5246] hover:underline">https://automattic.com/privacy/</a>. After approval of your comment, your profile picture is visible to the public in the context of your comment.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#0B1E33] font-montserrat tracking-tight">
                Media
              </h2>
              <p>
                If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#0B1E33] font-montserrat tracking-tight">
                Cookies
              </h2>
              <p>
                If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.
              </p>
              <p>
                If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.
              </p>
              <p>
                When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.
              </p>
              <p>
                If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#0B1E33] font-montserrat tracking-tight">
                Embedded content from other websites
              </h2>
              <p>
                Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.
              </p>
              <p>
                These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#0B1E33] font-montserrat tracking-tight">
                Who we share your data with
              </h2>
              <p>
                If you request a password reset, your IP address will be included in the reset email.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#0B1E33] font-montserrat tracking-tight">
                How long we retain your data
              </h2>
              <p>
                If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.
              </p>
              <p>
                For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#0B1E33] font-montserrat tracking-tight">
                What rights you have over your data
              </h2>
              <p>
                If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#0B1E33] font-montserrat tracking-tight">
                Where your data is sent
              </h2>
              <p>
                Visitor comments may be checked through an automated spam detection service.
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
