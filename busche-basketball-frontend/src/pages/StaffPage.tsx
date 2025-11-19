import { useEffect, useState } from "react";
import { publicApi } from "../api/publicApi";
import type { StaffMemberDto } from "../types";

export const StaffPage: React.FC = () => {
    const [staff, setStaff] = useState<StaffMemberDto[]>([]);

    useEffect(() => {
        publicApi.getStaff().then(setStaff).catch(console.error);
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Coaching Staff</h1>
            <div className="grid md:grid-cols-2 gap-4">
                {staff.map((s) => (
                    <div key={s.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                        <p className="font-semibold">{s.fullName}</p>
                        <p className="text-sm text-primary">{s.roleTitle}</p>
                        {s.bio && <p className="text-sm text-slate-300 mt-2">{s.bio}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};
