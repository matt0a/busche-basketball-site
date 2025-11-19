package org.buscheacademy.basketball.staff;

import jakarta.persistence.*;
import lombok.*;
import org.buscheacademy.basketball.common.BaseEntity;

@Entity
@Table(name = "staff_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String fullName;

    /**
     * e.g., "Head Coach", "Assistant Coach", "Athletic Director"
     */
    @Column(nullable = false, length = 120)
    private String roleTitle;

    @Column(length = 1500)
    private String bio;

    @Column(length = 500)
    private String photoUrl;

    @Column(length = 120)
    private String email;

    @Column(length = 40)
    private String phone;
}
