import React from "react";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import BaseTitle from "@/components/shared/BaseTitle";
import BaseDescription from "@/components/shared/BaseDescription";
import ServiceCard from "@/components/shared/Services/ServiceCard";
import ServiceList from "@/components/shared/Services/ServiceList";
import LivingSpacesSection from "@/components/sections/LivingSpacesSection";
import ServicesSection from "@/components/sections/ServicesSection";

// import Image from "next/image";


const services1 = [
  "Assistance with Daily Living (ADLs)",
  "Around the Clock Care",
  "Assistance with Medication",
  "Incidental Medical & Dental Needs",
];

const services2 = [
  "Specialized Memory Care",
  "Fall Prevention Monitoring",
  "Personal Hygiene Support",
  "Dementia Activities",
];

const services3 = [
  "Meal Preparation & Nutrition",
  "Housekeeping & Laundry",
  "Transportation Services",
  "Social & Recreational Activities",
];

export default function Home() {
  return (
    <>
      {/* Hero section - tràn nền nhưng nội dung giới hạn */}
      <section className="w-full bg-[#F0FAF7] py-20">
        <MaxWidthWrapper>
          {/* Hero content */}
          <h1 className="text-3xl font-bold">Hero Section</h1>
        </MaxWidthWrapper>
      </section>



      <section className="w-full bg-[#F0FAF7] py-20">
  <MaxWidthWrapper>
    <h1 className="text-3xl font-bold">Tôi nằm trong khung 1280</h1>
  </MaxWidthWrapper>
</section>


<section className="py-16 bg-background text-foreground">
  <MaxWidthWrapper>
    <BaseTitle>
      Our Living Spaces
    </BaseTitle>
    <BaseDescription className="text-center mt-6">
      Comfortable, clean, and personalized spaces where residents feel at home. Explore our beautifully maintained living environments.
    </BaseDescription>


    <div className="grid grid-cols-12 gap-[20px] mt-9">
      {/* 1 ảnh lớn + 2 ảnh nhỏ */}
      <div className="col-span-6">
        <img
          src="https://picsum.photos/800/500?random=1"
          alt="Placeholder"
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="col-span-3">
        <img
          src="https://picsum.photos/400/500?random=2"
          alt="Placeholder"
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="col-span-3">
        <img
          src="https://picsum.photos/400/500?random=3"
          alt="Placeholder"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Hàng thứ 2 */}
      <div className="col-span-3">
        <img
          src="https://picsum.photos/400/500?random=2"
          alt="Placeholder"
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="col-span-3">
        <img
          src="https://picsum.photos/400/500?random=3"
          alt="Placeholder"
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="col-span-6">
        <img
          src="https://picsum.photos/800/500?random=1"
          alt="Placeholder"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Hàng thứ 3 */}
      <div className="col-span-3">
        <img
          src="https://picsum.photos/400/500?random=2"
          alt="Placeholder"
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="col-span-6">
        <img
          src="https://picsum.photos/800/500?random=1"
          alt="Placeholder"
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="col-span-3">
        <img
          src="https://picsum.photos/400/500?random=3"
          alt="Placeholder"
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  </MaxWidthWrapper>
</section>

      <section className="py-20 bg-background text-foreground">
        <MaxWidthWrapper>
          <BaseTitle>Our Services</BaseTitle>
          <BaseDescription className="text-center mt-6">
            We offer a wide range of services to ensure the well-being and comfort of our residents. From daily care to specialized support, we are here to help.
          </BaseDescription>
        </MaxWidthWrapper>
      </section>

<section className="py-20">
  <MaxWidthWrapper>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
      <ServiceCard imageSrc="/images/Frame635.png" title="Care Services">
        <ServiceList items={services1} />
      </ServiceCard>

      <ServiceCard imageSrc="/images/icon-box-chat.png" title="Safety">
        <ServiceList items={services2} />
      </ServiceCard>

      <ServiceCard imageSrc="/images/icon-ghe.png" title="Amenneties">
        <ServiceList items={services3} />
      </ServiceCard>
    </div>
  </MaxWidthWrapper>
</section>



<LivingSpacesSection />
<ServicesSection/>

    </>
  );
}
