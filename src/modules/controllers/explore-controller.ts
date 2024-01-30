import { Request, Response, Router } from "express";
import BaseController from "./base-controller";
import { CommunityModel, CompanyModel, UniversityModel, UserModel } from "../../resolved-models";
import success from "../responses/success";


export class ExportController extends BaseController {
  listen(router: Router): void {
    router.get("/foryou", async (req, res, next) => {
      res.send(
        success({
          "interestedIn": [
            {
                type: "User",
                data:{
                    display_name: "Alev Akyıldız",
                    avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                    type: "User",
                    currentJob: "İnsan Kaynakları Yöneticisi",
                    organisations: "Turkcell",
                    city: "Eskişehir",
                    followerCount: 145,
                },
                rating: 10
            },
            {
                type: "Project",
                data: {
                    name: "AlecTED",
                    description: "AlecTED topluluğu olarak otonom araç projesi üzerinde çalışıyoruz.",
                    avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                    tags: ["Automotive", "Electronics", "Software", "Hardware", "Mechanical"],
                },
                rating: 3
            },
            {
                type: "Event",
                data: {
                    name: "Antalya Teknokent Demoday",
                    description: 'Antalya Teknokent ve farklabs iş birliği ile gerçekleştirilecek olan "Girişimci Yatırımcı Buluşması" etkinliğine davetlisiniz.',
                    creator: 2,
                    organizatorId: 3,
                    organizatorType: "company",
                    organizator: "Antalya Teknokent",
                    eventDate: "2021-03-21T13:00:00.000Z",
                    location: "Antalya Teknokent Ar-Ge 2 Uluğbey Binası Büyük Seminer Salonu",
                    image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg" //Random oluşturdum
                },
                rating: 8
            }
          ],
          "highlights": [
            {
                type: "Event",
                data: {
                    name: "Antalya Teknokent Demoday",
                    description: 'Antalya Teknokent ve farklabs iş birliği ile gerçekleştirilecek olan "Girişimci Yatırımcı Buluşması" etkinliğine davetlisiniz.',
                    creator: 2,
                    organizatorId: 3,
                    organizatorType: "company",
                    organizator: "Antalya Teknokent",
                    eventDate: "2021-03-21T13:00:00.000Z",
                    location: "Antalya Teknokent Ar-Ge 2 Uluğbey Binası Büyük Seminer Salonu",
                    image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg" //Random oluşturdum
                },
                rating: 10
            },
            {
                type: "Company",
                data: {
                    name: "PlayStation Türkiye",
                    description: "Pushing the Boundaries of Play",
                    image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                    sector: "Eğlence Sektörü Şirketi",
                    followerCount: "145",
                },
                rating: 9
            },
            {
                type: "Job Post",
                data: {
                    title: "İnsan Kaynakları Stajı",
                    creatorType: "Company",
                    creator: {
                        name: "Turkcell",
                        image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                    },
                    description: "Turkcell, Türkiye'nin önde gelen telekomünikasyon şirketlerinden biridir ve çalışanlarına yüksek değer vermektedir.",
                    jobType: 2,
                    workType: 1,
                    workingTime: 60
                },
                rating: 8
            }
          ],
          "popularInYourLocation": [
            {
                type: "User",
                data:{
                    display_name: "Alev Akyıldız",
                    avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                    type: "User",
                    currentJob: "İnsan Kaynakları Yöneticisi",
                    organisations: "Turkcell",
                    city: "Eskişehir",
                    followerCount: 145,
                },
                rating: 10
            },
            {
                type: "Project",
                data: {
                    name: "AlecTED",
                    description: "AlecTED topluluğu olarak otonom araç projesi üzerinde çalışıyoruz.",
                    avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                    tags: ["Automotive", "Electronics", "Software", "Hardware", "Mechanical"],
                },
                rating: 3
            },
            {
                type: "Event",
                data: {
                    name: "Antalya Teknokent Demoday",
                    description: 'Antalya Teknokent ve farklabs iş birliği ile gerçekleştirilecek olan "Girişimci Yatırımcı Buluşması" etkinliğine davetlisiniz.',
                    creator: 2,
                    organizatorId: 3,
                    organizatorType: "company",
                    organizator: "Antalya Teknokent",
                    eventDate: "2021-03-21T13:00:00.000Z",
                    location: "Antalya Teknokent Ar-Ge 2 Uluğbey Binası Büyük Seminer Salonu",
                    image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg" //Random oluşturdum
                },
                rating: 8
            }
          ]
        })
      );
    });
    router.get("/trending", async (req, res, next) => {
      res.send(
        success({
          "trending": [
            {
                type: "User",
                data:{
                    display_name: "Alev Akyıldız",
                    avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                    type: "User",
                    currentJob: "İnsan Kaynakları Yöneticisi",
                    organisations: "Turkcell",
                    city: "Eskişehir",
                    followerCount: 145,
                },
                rating: 10
            },
            {
                type: "Project",
                data: {
                    name: "AlecTED",
                    description: "AlecTED topluluğu olarak otonom araç projesi üzerinde çalışıyoruz.",
                    avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                    tags: ["Automotive", "Electronics", "Software", "Hardware", "Mechanical"],
                },
                rating: 3
            },
            {
                type: "Event",
                data: {
                    name: "Antalya Teknokent Demoday",
                    description: 'Antalya Teknokent ve farklabs iş birliği ile gerçekleştirilecek olan "Girişimci Yatırımcı Buluşması" etkinliğine davetlisiniz.',
                    creator: 2,
                    organizatorId: 3,
                    organizatorType: "company",
                    organizator: "Antalya Teknokent",
                    eventDate: "2021-03-21T13:00:00.000Z",
                    location: "Antalya Teknokent Ar-Ge 2 Uluğbey Binası Büyük Seminer Salonu",
                    image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg" //Random oluşturdum
                },
                rating: 8
            },
            {
                type: "Event",
                data: {
                    name: "Antalya Teknokent Demoday",
                    description: 'Antalya Teknokent ve farklabs iş birliği ile gerçekleştirilecek olan "Girişimci Yatırımcı Buluşması" etkinliğine davetlisiniz.',
                    creator: 2,
                    organizatorId: 3,
                    organizatorType: "company",
                    organizator: "Antalya Teknokent",
                    eventDate: "2021-03-21T13:00:00.000Z",
                    location: "Antalya Teknokent Ar-Ge 2 Uluğbey Binası Büyük Seminer Salonu",
                    image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg" //Random oluşturdum
                },
                rating: 10
            },
            {
                type: "Company",
                data: {
                    name: "PlayStation Türkiye",
                    description: "Pushing the Boundaries of Play",
                    image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                    sector: "Eğlence Sektörü Şirketi",
                    followerCount: "145",
                },
                rating: 9
            },
            {
                type: "Job Post",
                data: {
                    title: "İnsan Kaynakları Stajı",
                    creatorType: "Company",
                    creator: {
                        name: "Turkcell",
                        image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                    },
                    description: "Turkcell, Türkiye'nin önde gelen telekomünikasyon şirketlerinden biridir ve çalışanlarına yüksek değer vermektedir.",
                    jobType: 2,
                    workType: 1,
                    workingTime: 60
                },
                rating: 8
            }
          ]
        })
      );
    });
    router.get("/categories", async (req, res, next) => {
        res.send(
          success({
            categories2: ["Yükselişte Olanlar", "Partnerler", "Yeni Şirketler", "Ülkemden Şirketler", "Staj İlanı Yayınlayan Şirketler"],
            categories: [
                {
                  trending: [
                    {
                        type: "User",
                        data:{
                            display_name: "Alev Akyıldız",
                            avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                            type: "User",
                            currentJob: "İnsan Kaynakları Yöneticisi",
                            organisations: "Turkcell",
                            city: "Eskişehir",
                            followerCount: 145,
                        },
                        rating: 10
                    },
                    {
                        type: "Project",
                        data: {
                            name: "AlecTED",
                            description: "AlecTED topluluğu olarak otonom araç projesi üzerinde çalışıyoruz.",
                            avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                            tags: ["Automotive", "Electronics", "Software", "Hardware", "Mechanical"],
                        },
                        rating: 3
                    },
                    {
                        type: "Event",
                        data: {
                            name: "Antalya Teknokent Demoday",
                            description: 'Antalya Teknokent ve farklabs iş birliği ile gerçekleştirilecek olan "Girişimci Yatırımcı Buluşması" etkinliğine davetlisiniz.',
                            creator: 2,
                            organizatorId: 3,
                            organizatorType: "company",
                            organizator: "Antalya Teknokent",
                            eventDate: "2021-03-21T13:00:00.000Z",
                            location: "Antalya Teknokent Ar-Ge 2 Uluğbey Binası Büyük Seminer Salonu",
                            image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg" //Random oluşturdum
                        },
                        rating: 8
                    },
                    {
                        type: "Event",
                        data: {
                            name: "Antalya Teknokent Demoday",
                            description: 'Antalya Teknokent ve farklabs iş birliği ile gerçekleştirilecek olan "Girişimci Yatırımcı Buluşması" etkinliğine davetlisiniz.',
                            creator: 2,
                            organizatorId: 3,
                            organizatorType: "company",
                            organizator: "Antalya Teknokent",
                            eventDate: "2021-03-21T13:00:00.000Z",
                            location: "Antalya Teknokent Ar-Ge 2 Uluğbey Binası Büyük Seminer Salonu",
                            image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg" //Random oluşturdum
                        },
                        rating: 10
                    },
                    {
                        type: "Company",
                        data: {
                            name: "PlayStation Türkiye",
                            description: "Pushing the Boundaries of Play",
                            image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                            sector: "Eğlence Sektörü Şirketi",
                            followerCount: "145",
                        },
                        rating: 9
                    },
                    {
                        type: "Job Post",
                        data: {
                            title: "İnsan Kaynakları Stajı",
                            creatorType: "Company",
                            creator: {
                                name: "Turkcell",
                                image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                            },
                            description: "Turkcell, Türkiye'nin önde gelen telekomünikasyon şirketlerinden biridir ve çalışanlarına yüksek değer vermektedir.",
                            jobType: 2,
                            workType: 1,
                            workingTime: 60
                        },
                        rating: 8
                    }
                  ],
                  partners: [
                    {
                        type: "User",
                        data:{
                            display_name: "Alev Akyıldız",
                            avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                            type: "User",
                            currentJob: "İnsan Kaynakları Yöneticisi",
                            organisations: "Turkcell",
                            city: "Eskişehir",
                            followerCount: 145,
                        },
                        rating: 10
                    },
                    {
                        type: "Company",
                        data: {
                            name: "PlayStation Türkiye",
                            description: "Pushing the Boundaries of Play",
                            image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                            sector: "Eğlence Sektörü Şirketi",
                            followerCount: "145",
                        },
                        rating: 9
                    }
                  ],
                  newCompanies: [
                    {
                        type: "Company",
                        data: {
                            name: "PlayStation Türkiye",
                            description: "Pushing the Boundaries of Play",
                            image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                            sector: "Eğlence Sektörü Şirketi",
                            followerCount: "145",
                        },
                        rating: 9
                    }
                  ],
                  localCountries: [
                    {
                        type: "Company",
                        data: {
                            name: "PlayStation Türkiye",
                            description: "Pushing the Boundaries of Play",
                            image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                            sector: "Eğlence Sektörü Şirketi",
                            followerCount: "145",
                        },
                        rating: 9
                    }
                  ],
                  companiesWithJobPostings: [
                    {
                        type: "Company",
                        data: {
                            name: "Turkcell",
                            description: "Turkcell, Türkiye'nin önde gelen telekomünikasyon şirketlerinden biridir ve çalışanlarına yüksek değer vermektedir.",
                            image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                            sector: "İletişim",
                            followerCount: "166",
                        },
                        rating: 9
                    }
                  ]
                }
            ]
          })
        );
    });
    router.get("/following", async (req, res, next) => {
        res.send(
          success({
            projectsFromCommunities: [
                {
                    type: "Project",
                    data: {
                        name: "AlecTED",
                        description: "AlecTED topluluğu olarak otonom araç projesi üzerinde çalışıyoruz.",
                        avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                        tags: ["Automotive", "Electronics", "Software", "Hardware", "Mechanical"],
                    },
                    rating: 3
                },
                {
                    type: "Project",
                    data: {
                        name: "AlecTED",
                        description: "AlecTED topluluğu olarak otonom araç projesi üzerinde çalışıyoruz.",
                        avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                        tags: ["Automotive", "Electronics", "Software", "Hardware", "Mechanical"],
                    },
                    rating: 3
                },
                {
                    type: "Project",
                    data: {
                        name: "AlecTED",
                        description: "AlecTED topluluğu olarak otonom araç projesi üzerinde çalışıyoruz.",
                        avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                        tags: ["Automotive", "Electronics", "Software", "Hardware", "Mechanical"],
                    },
                    rating: 3
                }
            ],
            followedJobPosts: [
                {
                    type: "Job Post",
                    data: {
                        title: "İnsan Kaynakları Stajı",
                        creatorType: "Company",
                        creator: {
                            name: "Turkcell",
                            image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                        },
                        description: "Turkcell, Türkiye'nin önde gelen telekomünikasyon şirketlerinden biridir ve çalışanlarına yüksek değer vermektedir.",
                        jobType: 2,
                        workType: 1,
                        workingTime: 60
                    },
                    rating: 8
                },
                {
                    type: "Job Post",
                    data: {
                        title: "İnsan Kaynakları Stajı",
                        creatorType: "Company",
                        creator: {
                            name: "Turkcell",
                            image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                        },
                        description: "Turkcell, Türkiye'nin önde gelen telekomünikasyon şirketlerinden biridir ve çalışanlarına yüksek değer vermektedir.",
                        jobType: 2,
                        workType: 1,
                        workingTime: 60
                    },
                    rating: 8
                },
                {
                    type: "Job Post",
                    data: {
                        title: "İnsan Kaynakları Stajı",
                        creatorType: "Company",
                        creator: {
                            name: "Turkcell",
                            image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                        },
                        description: "Turkcell, Türkiye'nin önde gelen telekomünikasyon şirketlerinden biridir ve çalışanlarına yüksek değer vermektedir.",
                        jobType: 2,
                        workType: 1,
                        workingTime: 60
                    },
                    rating: 8
                }
            ],
            projectsFromFollowed: [
                {
                    type: "User",
                    data:{
                        display_name: "Alev Akyıldız",
                        avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                        type: "User",
                        currentJob: "İnsan Kaynakları Yöneticisi",
                        organisations: "Turkcell",
                        city: "Eskişehir",
                        followerCount: 145,
                    },
                    rating: 10
                },
                {
                    type: "Event",
                    data: {
                        name: "Antalya Teknokent Demoday",
                        description: 'Antalya Teknokent ve farklabs iş birliği ile gerçekleştirilecek olan "Girişimci Yatırımcı Buluşması" etkinliğine davetlisiniz.',
                        creator: 2,
                        organizatorId: 3,
                        organizatorType: "company",
                        organizator: "Antalya Teknokent",
                        eventDate: "2021-03-21T13:00:00.000Z",
                        location: "Antalya Teknokent Ar-Ge 2 Uluğbey Binası Büyük Seminer Salonu",
                        image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg" //Random oluşturdum
                    },
                    rating: 10
                },
                {
                    type: "Company",
                    data: {
                        name: "PlayStation Türkiye",
                        description: "Pushing the Boundaries of Play",
                        image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                        sector: "Eğlence Sektörü Şirketi",
                        followerCount: "145",
                    },
                    rating: 9
                }
            ],
            favoriteCategories: ["Partnerler", "Eğlence Sektörü", "İletişim Sektörü"],
            eventsFromFollowed: [
                {
                    type: "Event",
                    data: {
                        name: "Antalya Teknokent Demoday",
                        description: 'Antalya Teknokent ve farklabs iş birliği ile gerçekleştirilecek olan "Girişimci Yatırımcı Buluşması" etkinliğine davetlisiniz.',
                        creator: 2,
                        organizatorId: 3,
                        organizatorType: "company",
                        organizator: "Antalya Teknokent",
                        eventDate: "2021-03-21T13:00:00.000Z",
                        location: "Antalya Teknokent Ar-Ge 2 Uluğbey Binası Büyük Seminer Salonu",
                        image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg" //Random oluşturdum
                    },
                    rating: 10
                },
                {
                    type: "Event",
                    data: {
                        name: "Antalya Teknokent Demoday",
                        description: 'Antalya Teknokent ve farklabs iş birliği ile gerçekleştirilecek olan "Girişimci Yatırımcı Buluşması" etkinliğine davetlisiniz.',
                        creator: 2,
                        organizatorId: 3,
                        organizatorType: "company",
                        organizator: "Antalya Teknokent",
                        eventDate: "2021-03-21T13:00:00.000Z",
                        location: "Antalya Teknokent Ar-Ge 2 Uluğbey Binası Büyük Seminer Salonu",
                        image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg" //Random oluşturdum
                    },
                    rating: 10
                },
                {
                    type: "Event",
                    data: {
                        name: "Antalya Teknokent Demoday",
                        description: 'Antalya Teknokent ve farklabs iş birliği ile gerçekleştirilecek olan "Girişimci Yatırımcı Buluşması" etkinliğine davetlisiniz.',
                        creator: 2,
                        organizatorId: 3,
                        organizatorType: "company",
                        organizator: "Antalya Teknokent",
                        eventDate: "2021-03-21T13:00:00.000Z",
                        location: "Antalya Teknokent Ar-Ge 2 Uluğbey Binası Büyük Seminer Salonu",
                        image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg" //Random oluşturdum
                    },
                    rating: 10
                }
            ]
          })
        );
    });
    router.get("/saved", async (req, res, next) => {
        res.send(
          success({
            saved: [
                {
                    type: "User",
                    data:{
                        display_name: "Alev Akyıldız",
                        avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                        type: "User",
                        currentJob: "İnsan Kaynakları Yöneticisi",
                        organisations: "Turkcell",
                        city: "Eskişehir",
                        followerCount: 145,
                    },
                    rating: 10
                },
                {
                    type: "Project",
                    data: {
                        name: "AlecTED",
                        description: "AlecTED topluluğu olarak otonom araç projesi üzerinde çalışıyoruz.",
                        avatar_url: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                        tags: ["Automotive", "Electronics", "Software", "Hardware", "Mechanical"],
                    },
                    rating: 3
                },
                {
                    type: "Event",
                    data: {
                        name: "Antalya Teknokent Demoday",
                        description: 'Antalya Teknokent ve farklabs iş birliği ile gerçekleştirilecek olan "Girişimci Yatırımcı Buluşması" etkinliğine davetlisiniz.',
                        creator: 2,
                        organizatorId: 3,
                        organizatorType: "company",
                        organizator: "Antalya Teknokent",
                        eventDate: "2021-03-21T13:00:00.000Z",
                        location: "Antalya Teknokent Ar-Ge 2 Uluğbey Binası Büyük Seminer Salonu",
                        image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg" //Random oluşturdum
                    },
                    rating: 8
                },
                {
                    type: "Event",
                    data: {
                        name: "Antalya Teknokent Demoday",
                        description: 'Antalya Teknokent ve farklabs iş birliği ile gerçekleştirilecek olan "Girişimci Yatırımcı Buluşması" etkinliğine davetlisiniz.',
                        creator: 2,
                        organizatorId: 3,
                        organizatorType: "company",
                        organizator: "Antalya Teknokent",
                        eventDate: "2021-03-21T13:00:00.000Z",
                        location: "Antalya Teknokent Ar-Ge 2 Uluğbey Binası Büyük Seminer Salonu",
                        image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg" //Random oluşturdum
                    },
                    rating: 10
                },
                {
                    type: "Company",
                    data: {
                        name: "PlayStation Türkiye",
                        description: "Pushing the Boundaries of Play",
                        image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                        sector: "Eğlence Sektörü Şirketi",
                        followerCount: "145",
                    },
                    rating: 9
                },
                {
                    type: "Job Post",
                    data: {
                        title: "İnsan Kaynakları Stajı",
                        creatorType: "Company",
                        creator: {
                            name: "Turkcell",
                            image: "https://i.pinimg.com/originals/0f/6e/9e/0f6e9e2b6b5b6b6b6b6b6b6b6b6b6b6b.jpg", //Random oluşturdum
                        },
                        description: "Turkcell, Türkiye'nin önde gelen telekomünikasyon şirketlerinden biridir ve çalışanlarına yüksek değer vermektedir.",
                        jobType: 2,
                        workType: 1,
                        workingTime: 60
                    },
                    rating: 8
                }
            ]
          })
        );
    });
  }
}