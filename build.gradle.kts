import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

val generatedOpenApiBackendDirectory by extra("$buildDir/openapi/generated")
val mergedOpenApiDirectory by extra("$buildDir/openapi/merged")
val openApiSchemasDirectory by extra("$projectDir/openapi-schemas")

plugins {
    id("org.springframework.boot") version "3.0.0"
    id("io.spring.dependency-management") version "1.1.0"
    id("org.openapi.generator") version "5.3.0"
    id("com.rameshkp.openapi-merger-gradle-plugin") version "1.0.4"
    kotlin("jvm") version "1.7.21"
    kotlin("plugin.spring") version "1.7.21"
    kotlin("kapt") version "1.6.10"
}

group = "com.financey"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("javax.validation:validation-api:2.0.1.Final")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("javax.servlet:javax.servlet-api:4.0.1") // todo fix??
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    implementation("org.mapstruct:mapstruct:1.5.3.Final")
    implementation("org.mapstruct:mapstruct-processor:1.5.3.Final")
    implementation("io.arrow-kt:arrow-core:1.1.2")
    kapt("org.mapstruct:mapstruct-processor:1.5.3.Final")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "17"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

sourceSets {
    main {
        kotlin.srcDir("$buildDir/openapi/generated/src/main/kotlin")
    }
}

val openapiSpecs = mapOf(
    "mainView" to "openapi-schemas/EntrySchema.yaml",
    "budgetsView" to "openapi-schemas/BudgetsSchema.yaml"
)
openapiSpecs.forEach {
    tasks.create("openApiGenerate-${it.key}", org.openapitools.generator.gradle.plugin.tasks.GenerateTask::class) {
        generatorName.set("kotlin-spring")
        inputSpec.set("$rootDir/${it.value}")
        outputDir.set(generatedOpenApiBackendDirectory)

        configOptions.set(mapOf(
            "interfaceOnly" to "true",
            "dateLibrary" to "java8",
            "useTags" to "true",
            "enumPropertyNaming" to "UPPERCASE"
        ))
        sourceSets.getByName(SourceSet.MAIN_SOURCE_SET_NAME).java.srcDir("$buildDir/generated/openapi/src")
    }
}
tasks.register("openApiGenerateAll") { dependsOn(openapiSpecs.keys.map { "openApiGenerate-$it" }, "clean") }
