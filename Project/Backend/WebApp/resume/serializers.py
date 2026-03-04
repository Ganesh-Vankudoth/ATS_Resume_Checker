from rest_framework import serializers
from .models import Resume

class ResumeSerializer(serializers.ModelSerializer):
    job_role_display = serializers.CharField(source='get_job_role_display', read_only=True)
    
    # New fields that are not in the database
    matched_list = serializers.SerializerMethodField()
    missing_list = serializers.SerializerMethodField()

    class Meta:
        model = Resume
        fields = [
            'id', 'file', 'job_role', 'job_role_display', 
            'score', 'matched_list', 'missing_list', 'created_at'
        ]

    def get_matched_list(self, obj):
        # Converts the comma-separated string back into a list for React
        return obj.matched_keywords.split(", ") if obj.matched_keywords else []

    def get_missing_list(self, obj):
        # You can pass context from the view to the serializer
        return self.context.get('missing', [])