'use client'

import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { TbCircleCheckFilled } from "react-icons/tb";
import { ButtonSky } from "@/components/global/Button";

interface Table {
    tahun: number;
}

interface PohonKinerja {
    id_pohon: number;
    tahun: number;
    nama_pohon: string;
    kode_opd: string;
    nama_opd: string;
    jenis_pohon: string;
    keterangan_tagging: string;
}

interface TaggingData {
    nama_tagging: string;
    tahun: number;
    pohon_kinerjas: PohonKinerja[];
}

export const Table: React.FC<Table> = ({ tahun }) => {

    const [DataTagging, setDataTagging] = useState<TaggingData | null>(null);

    const [NamaTagging, setNamaTagging] = useState<string>('');
    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchDataTagging = async () => {
            setLoading(true)
            try {
                const response = await fetch(`https://tagging-service-mahulu.zeabur.app/laporan/tagging_pokin?nama_tagging=${encodeURIComponent(NamaTagging)}&tahun=${tahun}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();
                const data = result.data[0];
                if (result.status === 200 || result.status === 201) {
                    setDataTagging(data);
                    console.log(data);
                    setError(false);
                } else {
                    setError(true);
                    setDataTagging(null);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        if (NamaTagging) {
            fetchDataTagging();
        }
    }, [tahun, NamaTagging]);

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 p-2 w-full">
            <div className="flex items-center gap-2">
                <button
                    className={`flex items-center gap-1 p-2 border ${NamaTagging === "Program Unggulan Bupati" ? 'bg-sky-500 text-white' : 'border-sky-500 text-sky-500'} rounded-lg hover:bg-sky-500 hover:text-white
                        `}
                    onClick={() => setNamaTagging("Program Unggulan Bupati")}
                >
                    <TbCircleCheckFilled />
                    Program Unggulan Bupati
                </button>
                <button
                    className={`flex items-center gap-1 p-2 border ${NamaTagging === "100 Hari Kerja Bupati" ? 'bg-sky-500 text-white' : 'border-sky-500 text-sky-500'} rounded-lg hover:bg-sky-500 hover:text-white
                        `}
                    onClick={() => setNamaTagging("100 Hari Kerja Bupati")}
                >
                    <TbCircleCheckFilled />
                    100 Hari Kerja Bupati
                </button>
                <button
                    className={`flex items-center gap-1 p-2 border ${NamaTagging === "Program Unggulan Pemerintah Pusat" ? 'bg-sky-500 text-white' : 'border-sky-500 text-sky-500'} rounded-lg hover:bg-sky-500 hover:text-white
                        `}
                    onClick={() => setNamaTagging("Program Unggulan Pemerintah Pusat")}
                >
                    <TbCircleCheckFilled />
                    Program Unggulan Pemerintah Pusat
                </button>
            </div>
            {NamaTagging === "" ?
                <h1 className="p-3 border rounded-lg">Pilih Tagging Terlebih Dahulu</h1>
                :
                <div className="overflow-auto rounded-t-xl border">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-emerald-500 text-white">
                                <th className="border-r border-b px-6 py-3 w-[50px]">No</th>
                                <th className="border-r border-b px-6 py-3 min-w-[200px]">Nama Pohon</th>
                                <th className="border-r border-b px-6 py-3 min-w-[100px]">Level Pohon</th>
                                <th className="border-r border-b px-6 py-3 min-w-[100px]">Perangkat Daerah</th>
                                <th className="border-l border-b px-6 py-3 min-w-[200px]">{DataTagging?.nama_tagging || "Tagging"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(DataTagging?.pohon_kinerjas?.length === 0 || DataTagging?.pohon_kinerjas === null) ?
                                <tr>
                                    <td className="px-6 py-3 uppercase" colSpan={13}>
                                        Data Kosong / Belum Ditambahkan
                                    </td>
                                </tr>
                                :
                                DataTagging?.pohon_kinerjas.map((p: PohonKinerja, index: number) => (
                                    <tr key={index}>
                                        <td className="border-r border-b px-6 py-4">{index + 1}</td>
                                        <td className="border-r border-b px-6 py-4">{p.nama_pohon || "-"} ({p.id_pohon || "-"})</td>
                                        <td className="border-r border-b px-6 py-4">{p.jenis_pohon || "-"}</td>
                                        <td className="border-r border-b px-6 py-4">{p.nama_opd || "-"}</td>
                                        <td className="border-r border-b px-6 py-4">{p.keterangan_tagging || "-"}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}