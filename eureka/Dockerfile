FROM openjdk:8-jre-alpine

ADD ./eureka/eureka-service-0.0.1-SNAPSHOT.jar eureka-service-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java", "-jar", "/eureka-service-0.0.1-SNAPSHOT.jar"]

EXPOSE 8080