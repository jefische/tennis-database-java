package com.tennisdb.server.repository;

import java.util.Optional;
import com.tennisdb.server.model.Video;

// import jakarta.persistence.EntityManager;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

// Note the two types passed to the JpaRepository interface <T, ID> represent
// the Entity class and its Primary Key data type.
// This tells Spring which database table this repository is responsible for managing.

// Additional details: Spring handles the implementation of the defined interface below
// at runtime, writing all of the basic CRUD methods based on the method signatures the
// interface defines such as save(), findAll(), delete(), etc. The class implementation at
// runtime is SimpleJpaRepository, which outputs JPQL.

// public class SimpleJpaRepository<T, ID> implements JpaRepository<T, ID> {

//     private final EntityManager em; // The engine that talks to the DB

//     // Constructor injection of EntityManager...

//     @Override
//     public Optional<T> findById(ID id) {
//         // ... safety checks ...
        
//         // This Hibernate call tells the DB to run: "SELECT * FROM table WHERE id = ?"
//         return Optional.ofNullable(em.find(getDomainClass(), id));
//     }
// }

// Note that EntityManager is an interface defined by JPA and Hibernate provides the implementation
// of this at runtime as well. This implemented class is what communicates with the database and
// converts the JPQL into SQL.

// So JpaRepository effectively replaces the need to write custom DAO interfaces and implementation 
// classes for standard database operations



@Repository
public interface VideoRepository extends JpaRepository<Video, Integer> {
	
	Optional<Video> findByYoutubeId(String id);
}
