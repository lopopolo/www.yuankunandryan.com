#!/usr/bin/env python3

from datetime import datetime

# The below timestamps are derived from photo `DSC02476.JPG`, which has original
# timestamp `2014-01-01T21:34:46-07:00` and shows Ryan's watch at
# `2020-06-27T10:15:00-07:00`

# incorrect timeline
camera = datetime(2014, 1, 1, 21, 34, 46)
# correct timeline
watch = datetime(2020, 6, 27, 10, 15, 0)

adjustment = watch - camera

print(
    f"""\
Original timestamp: {camera}
Corrected timestamp: {watch}
Adjustment: {adjustment}"""
)

first_photo = datetime(2014, 1, 1, 2, 0, 23)
adjusted_first_photo = first_photo + adjustment

print(f"Adjust first photo to: {adjusted_first_photo}")
