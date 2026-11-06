-- Tags product photos with their colour so the product page switches the picture when a colour is clicked.
-- Run once in the Supabase SQL editor. Safe to re-run (only touches photos that have no colour yet).
-- Colours were read from the photos themselves.

update product_images set color_id = 29 where id = 484 and color_id is null; -- chazer-ruhi-1: green
update product_images set color_id = 9  where id = 485 and color_id is null; -- chazer-ruhi-1: Pink
update product_images set color_id = 30 where id = 482 and color_id is null; -- chazer-dream-13: Cream
update product_images set color_id = 9  where id = 483 and color_id is null; -- chazer-dream-13: Pink
update product_images set color_id = 5  where id = 552 and color_id is null; -- airson-maddy-17: Blue
update product_images set color_id = 5  where id = 553 and color_id is null; -- airson-maddy-17: Blue
update product_images set color_id = 1  where id = 548 and color_id is null; -- airson-rocky: Black
update product_images set color_id = 4  where id = 439 and color_id is null; -- avalon-1076: Brown
update product_images set color_id = 8  where id = 440 and color_id is null; -- avalon-1076: Beige
update product_images set color_id = 3  where id = 459 and color_id is null; -- thesis-9144: Navy
update product_images set color_id = 24 where id = 460 and color_id is null; -- thesis-9144: WINE
update product_images set color_id = 1  where id = 472 and color_id is null; -- airson-comfort-41: Black
update product_images set color_id = 23 where id = 473 and color_id is null; -- airson-comfort-41: Olive
update product_images set color_id = 38 where id = 615 and color_id is null; -- khadims-308: C.GREEN
update product_images set color_id = 9  where id = 616 and color_id is null; -- khadims-308: Pink
update product_images set color_id = 5  where id = 523 and color_id is null; -- ajanta-health: Blue
update product_images set color_id = 1  where id = 524 and color_id is null; -- ajanta-health: Black
update product_images set color_id = 9  where id = 574 and color_id is null; -- flite-fl-469: Pink
update product_images set color_id = 7  where id = 575 and color_id is null; -- flite-fl-469: Tan
update product_images set color_id = 3  where id = 588 and color_id is null; -- paragon-stg3294a: Navy
update product_images set color_id = 6  where id = 589 and color_id is null; -- paragon-stg3294a: Grey
update product_images set color_id = 43 where id = 617 and color_id is null; -- stout-kiddy-star: FIROZI
update product_images set color_id = 43 where id = 618 and color_id is null; -- stout-kiddy-star: FIROZI
update product_images set color_id = 11 where id = 619 and color_id is null; -- stout-kiddy-star: Red
update product_images set color_id = 46 where id = 642 and color_id is null; -- walkaroo-bx1672: Grey Blue
update product_images set color_id = 4  where id = 643 and color_id is null; -- walkaroo-bx1672: Brown
