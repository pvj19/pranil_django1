from django.conf import settings
from django.contrib import messages
from django.core.mail import send_mail
from django.shortcuts import redirect, render

from .forms import EnquiryForm

# Course tools and reviews are static content for now. Move these to
# models (e.g. a Course / Review model) once you want to edit them
# without a deploy.
COURSES = [
    {
        "url": "https://www.tradeonlevel.com/courses/672199",
        "image": "marketpath/images/Screenshot 2024-01-17 114402.jpg",
        "tags": ["FREE CONTENT", "VIDEOS", "FILES"],
        "title": "Participants Data analysis Excel",
        "price_new": "\u20b9 2,000",
        "price_old": "\u20b9 3,000",
        "discount": "33% OFF",
    },
    {
        "url": "https://www.tradeonlevel.com/courses/661281",
        "image": "marketpath/images/alloptionchainthumbnail1.jpg",
        "tags": ["MULTIPLE VALIDITY", "FREE CONTENT", "VIDEOS"],
        "title": "All stocks & Indices Live Option chain data update & Record ...",
        "price_new": "\u20b9 5,000",
        "price_old": "\u20b9 8,000",
        "discount": "37% OFF",
    },
    {
        "url": "https://www.tradeonlevel.com/courses/652850",
        "image": "marketpath/images/alloptionchainthumbnail1.jpg",
        "tags": ["MULTIPLE VALIDITY", "FREE CONTENT", "VIDEOS"],
        "title": "Upstox All stocks & Indices Live Option chain data...",
        "price_new": "\u20b9 5,000",
        "price_old": "\u20b9 8,000",
        "discount": "37% OFF",
    },
    {
        "url": "https://www.tradeonlevel.com/courses/632405",
        "image": "marketpath/images/stockanalysiscoursethumbnail.jpg",
        "tags": ["MULTIPLE VALIDITY", "FREE CONTENT", "VIDEOS"],
        "title": "Complete solution for Automation of Stocks eod and live data fetch...",
        "price_new": "\u20b9 10,000",
        "price_old": "",
        "discount": "",
    },
    {
        "url": "https://www.tradeonlevel.com/courses/610513",
        "image": "marketpath/images/alloptionchainpythonthumbnail.jpg",
        "tags": ["MULTIPLE VALIDITY", "FREE CONTENT", "VIDEOS"],
        "title": "Automatically Update of Nifty total market live data & All...",
        "price_new": "\u20b9 5,000",
        "price_old": "",
        "discount": "",
    },
    {
        "url": "https://www.tradeonlevel.com/courses/519196",
        "image": "marketpath/images/UNIQUECOURSEVIDEOS2.jpg",
        "tags": ["VIDEOS"],
        "title": "Unique Learning Course for Trading in Nifty and Banknifty (...",
        "price_new": "\u20b9 5,000",
        "price_old": "\u20b9 6,000",
        "discount": "16% OFF",
    },
    {
        "url": "https://www.tradeonlevel.com/courses/503855",
        "image": "marketpath/images/deltatradingthumbnail.jpg",
        "tags": ["VIDEOS"],
        "title": "Delta Trading Excel",
        "price_new": "\u20b9 11,000",
        "price_old": "\u20b9 13,000",
        "discount": "15% OFF",
    },
    {
        "url": "https://www.tradeonlevel.com/courses/462585",
        "image": "marketpath/images/candlestickdata.jpg",
        "tags": ["VIDEOS"],
        "title": "Live Candlestick data in excel for intraday timeframes with preset...",
        "price_new": "\u20b9 7,000",
        "price_old": "\u20b9 9,000",
        "discount": "22% OFF",
    },
    {
        "url": "https://www.tradeonlevel.com/courses/460048",
        "image": "marketpath/images/onlylivetickdatathumbnail.jpg",
        "tags": ["VIDEOS"],
        "title": "Only live tick data Excel (No trading functions) & Save Every...",
        "price_new": "\u20b9 5,000",
        "price_old": "\u20b9 6,000",
        "discount": "16% OFF",
    },
]

REVIEWS = [
    {
        "paragraphs": [
            "I had purchased excel sheets and scanners which has been very useful.",
            "Further if any problem arised in the said sheets, Sir is always one call away and he always managed to solve the problem.",
            "He provides best excel sheets in the market for scanning the stock and provides best technical support also.",
            "I am not good in handling computers so sir guided me step by step on call, and when I was still unable to set the excel sheets on my computer, sir himself took charge and did it on my laptop using Quick Viewer.",
        ],
        "name": "Nishi",
        "image": "marketpath/images/learner1.jpg",
    },
    {
        "paragraphs": [
            "I have purchased FII/DII Data, Stock EOD Analysis, Nifty Banknifty Optionchain and Cookie Sheets and have been using these from April 2022 till now.",
            "I have learnt a lot about the market through using these sheets and his videos.",
            "I always get support related to his products whenever required. You don\u2019t sell products, you make connections with traders and investors. I have never seen any support like this in the market.",
            "Thank you for the support and guidance.",
        ],
        "name": "Ramesh",
        "image": "marketpath/images/learner2.jpg",
    },
    {
        "paragraphs": [
            "I purchased Excel analysis tools from Vijaybhai almost one year ago, and I am delighted with my experience. The tools have not only proven to be powerful and user-friendly but also come with the added benefit of regular updates.",
            "The Excel tools have significantly enhanced my data analysis capabilities, offering a range of features that have made my tasks more efficient and accurate. The intuitive interface has made navigating complex data sets a breeze.",
            "What sets him apart is the commitment to continuous improvement. The regular updates ensure the tools stay current with the latest advancements and industry trends.",
            "In addition to the excellent product, I must commend Vijaybhai for exceptional customer service \u2014 prompt and helpful in addressing any queries.",
            "I wholeheartedly recommend the Excel analysis tools from Vijaybhai.",
        ],
        "name": "Ketan Dadhaviya",
        "image": "marketpath/images/learner3.jpg",
    },
]
# Real customer reviews. Add more entries here any time \u2014 the carousel
# picks up new ones automatically.

def index(request):
    if request.method == "POST":
        form = EnquiryForm(request.POST)
        if form.is_valid():
            enquiry = form.save()

            send_mail(
                subject=f"New enquiry: {enquiry.name} ({enquiry.get_interest_display()})",
                message=(
                    f"Name: {enquiry.name}\n"
                    f"Phone: {enquiry.phone}\n"
                    f"Interested in: {enquiry.get_interest_display()}\n"
                    f"Message: {enquiry.message or '(none)'}\n"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.ENQUIRY_NOTIFY_EMAIL],
                fail_silently=False,
            )

            messages.success(
                request,
                f"Thanks, {enquiry.name}. We\u2019ll get back to you on "
                f"{enquiry.phone}.",
            )
            return redirect(f"{request.path}#contact")
    else:
        form = EnquiryForm()

    context = {
        "form": form,
        "courses": COURSES,
        "reviews": REVIEWS,
    }
    return render(request, "marketpath/index.html", context)