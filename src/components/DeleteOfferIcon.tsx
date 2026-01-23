"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

export function DeleteOfferIcon({offerId} : {offerId : string}) {
    const router = useRouter()
    const [loading , setLoading] = useState(false);

    async function onDelete() {
        const ok = window.confirm(
            "Delete this offer? This action cannot be undone"
        );
        if(!ok) return;
        
        setLoading(true)

        try{

            const res = await fetch(`/api/offers/${offerId}`,{
                method: "DELETE",
            });

            if(!res.ok){
                throw new Error("Failed to delete offer");
            }
             router.refresh();
        }finally{
             setLoading(false);
        }

    }
    return (
        <button
          onClick={onDelete}
          disabled={loading}
          title="Delete offer"
          className="text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          <FiTrash2 size={18} />
        </button>
    );
}