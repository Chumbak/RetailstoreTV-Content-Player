# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from datetime import timedelta

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

from cloudinary.models import CloudinaryField


class Store(models.Model):
    FETCH_INTERVAL = 1800  # Used to check if the store is active. (in seconds)

    code = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    disabled = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=100)
    last_check_in = models.DateTimeField(null=True, blank=True)
    login_user = models.ForeignKey(User)

    def __unicode__(self):
        return "{name}, {city} ({active})".format(
            name=self.name,
            city=self.city,
            active=self.is_active,
        )

    def store_details_dict(self):
        return {'code': self.code, 'name': self.name, 'city': self.city}

    @property
    def is_active(self):
        # If the last check in happened within the interval, the store is active.
        if self.last_check_in:
            if (self.last_check_in + timedelta(seconds=self.FETCH_INTERVAL)) >= timezone.now():
                return "Active"
            else:
                return "Inactive"
        else:
            return "Never checked in"


class StoreContent(models.Model):
    IMAGE_CONTENT = 1
    VIDEO_CONTENT = 2

    CONTENT_CHOICES = (
        (IMAGE_CONTENT, 'Image'),
        (VIDEO_CONTENT, 'Video')
    )

    store = models.ManyToManyField(Store, related_name="content")
    content_type = models.IntegerField(choices=CONTENT_CHOICES, default=IMAGE_CONTENT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    # https://github.com/cloudinary/pycloudinary/issues/87
    # resource_type value in unicode will throw UnicodeDecodeError on upload
    image_file = CloudinaryField(resource_type=b'image', null=True, blank=True)
    video_file = CloudinaryField(resource_type=b'video', null=True, blank=True)
    sort_order = models.IntegerField(default=100)

    def save(self, *args, **kwargs):
        if self.image_file:
            self.content_type = self.IMAGE_CONTENT
        elif self.video_file:
            self.content_type = self.VIDEO_CONTENT
        super(StoreContent, self).save(*args, **kwargs)

    def copy_content(self):
        pass

    def file(self):
        return self.image_file if self.content_type == self.IMAGE_CONTENT else self.video_file

    def get_file_tag(self):
        # get a thumbnail for the content to be shown in admin
        return self.file().image(width=100, crop="fit", secure=True)
    get_file_tag.show_description = "Thumbnail"
    get_file_tag.allow_tags = True

    def content_details_dict(self):
        return {
            'content_type': self.content_type,
            'url': self.file().url
        }

    def is_enabled(self):
        if (not self.start_time or self.start_time <= timezone.now()) and (not self.end_time or self.end_time >= timezone.now()):
            return True
        else:
            return False
    is_enabled.boolean = True

    def __unicode__(self):
        return "{type}: {file}".format(type=self.get_content_type_display(), file=self.file())
