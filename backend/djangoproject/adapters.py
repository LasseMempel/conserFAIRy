import traceback
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

class DebugSocialAccountAdapter(DefaultSocialAccountAdapter):
    def on_authentication_error(self, request, provider_id, error=None, exception=None, extra_context=None):
        print("=== AUTH ERROR ===")
        print("Provider:", provider_id)
        print("Error:", error)
        print("Exception:", repr(exception))
        if exception:
            traceback.print_exception(type(exception), exception, exception.__traceback__)
        print("==================")
        return super().on_authentication_error(request, provider_id, error=error, exception=exception, extra_context=extra_context)

    def pre_social_login(self, request, sociallogin):
        print("=== PRE SOCIAL LOGIN ===")
        print("UID:", sociallogin.account.uid)
        print("Extra data:", sociallogin.account.extra_data)
        print("Email addresses:", sociallogin.email_addresses)
        print("========================")
        return super().pre_social_login(request, sociallogin)
