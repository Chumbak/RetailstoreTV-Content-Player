# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
import bulk_admin

from cms.models import Store, StoreContent


@admin.register(Store)
class StoreAdmin(bulk_admin.BulkModelAdmin):
    """Using bulk_admin module here. BulkModelAdmin makes it easier for 
    content managers to upload multiple stores in one go using formsets"""
    
    search_fields = ('code', 'name', 'city')
    fields = ('code', 'name', 'city', 'disabled', 'sort_order', 'login_user')
    list_display = ('name', 'city', 'disabled', 'sort_order', 'is_active', 'last_check_in')
    readonly_fields = ('last_check_in', )


@admin.register(StoreContent)
class StoreContentAdmin(bulk_admin.BulkModelAdmin):
    """Using bulk_admin module here. BulkModelAdmin makes it easier for 
    content managers to upload multiple store contents in one go using formsets"""
    
    list_display = ('get_file_tag', 'content_type', 'sort_order', 'start_time', 'end_time', 'is_enabled')
    fields = ('store', 'start_time', 'end_time', 'image_file', 'video_file')
    search_fields = ('image_file', 'video_file')
    bulk_upload_fields = ('image_file', 'video_file')
    readonly_fields = ('content_type', )
